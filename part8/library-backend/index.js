const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

require("dotenv").config();

const bcrypt = require("bcrypt");

const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connecting to MongoDB");
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `
type Book {
  title: String!
  published: Int!
  author: Author!
  id:ID!
  genres: [String]!
}
type Author {
  name: String!
  id: ID!
  born: Int
  bookCount: Int
}
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}
type Query {
  bookCount: Int!
  authorCount: Int!
  allBooks(
  author: String
  genre: String
  ): [Book!]!
  allAuthors: [Author!]!
  me: User
}
type Mutation {
  addBook(
    title: String!
    published: Int!
    author: String!
    genres: [String]!
  ): Book
  editAuthor(
    name: String!
    setBornTo: Int
  ): Author
  createUser(
    username: String!
    favoriteGenre: String!
    password: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
`;

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
    bookCount: async (root) => {
      const books = await Book.find({});
      return books.filter((b) => String(b.author) === String(root._id)).length;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : false;
    if (auth && auth.startsWith("Bearer ")) {
      try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decodedToken.id);
        return { currentUser };
      } catch (error) {
        if (error.message === "jwt expired") return { currentUser: null };
        else console.log(error.message);
      }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
