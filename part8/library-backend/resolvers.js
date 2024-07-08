const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const pubsub = new PubSub();

require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      let response = await Book.find({}).populate("author");
      if (args.author)
        response = response.filter((b) => b.author.name === args.author);
      if (args.genre)
        response = response.filter((b) => b.genres.includes(args.genre));
      return response;
    },
    allAuthors: async () => {
      return Author.find({});
    },
    me: async (root, args, { currentUser }) => {
      return currentUser;
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) throw new GraphQLError("Wrong credentials");
      const { title, author } = { ...args };
      const bookExists = await Book.find({ title });
      if (bookExists.length > 0) {
        throw new GraphQLError("Duplicate title", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.title,
          },
        });
      }
      const authorExists = await Author.find({ name: author });
      if (authorExists.length === 0) {
        const newAuthor = new Author({ name: author });
        try {
          await newAuthor.save();
        } catch (error) {
          throw new GraphQLError("Adding author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: author,
              error,
            },
          });
        }
      }
      const authorObject = await Author.findOne({ name: author });
      const newBook = new Book({ ...args, author: authorObject });
      try {
        await newBook.save();
      } catch (error) {
        throw new GraphQLError("Adding book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: { ...args },
            error,
          },
        });
      }
      pubsub.publish("BOOK_ADDED", { bookAdded: newBook });
      return newBook;
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) throw new GraphQLError("Wrong credentials");
      const author = await Author.findOne({ name: args.name });
      if (!author) throw new GraphQLError("Author not found");
      const updatedAuthor = { ...author._doc, born: args.setBornTo || null };
      await Author.findByIdAndUpdate(author._id, updatedAuthor);
      return updatedAuthor;
    },
    createUser: async (root, args) => {
      const { password, ...userObject } = { ...args };
      if (password.length <= 3)
        throw new GraphQLError("Password too short", {
          extensions: {
            code: "BAD_USER_INPUT",
            error: "Password too short",
          },
        });
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ ...userObject, passwordHash });

      return await user.save().catch((error) => {
        throw new GraphQLError("Adding user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const { username, password } = { ...args };
      const user = await User.findOne({ username });
      const passwordValidation = user
        ? await bcrypt.compare(password, user.passwordHash)
        : false;
      if (!(passwordValidation && user))
        throw new GraphQLError("Invalid credentials", {
          extensions: {
            error: "Invalid username or password",
          },
        });
      return {
        value: jwt.sign({ username, id: user._id }, process.env.JWT_SECRET, {
          expiresIn: 60 * 60,
        }),
      };
    },
  },
  Author: {
    bookCount: async (root, args, { loaders }) => {
      return loaders.bookCount.load(root._id);
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};
module.exports = resolvers;
