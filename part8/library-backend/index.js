const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const mongoose = require("mongoose");
const Book = require("./models/book");
const Author = require("./models/author");
const author = require("./models/author");
require("dotenv").config();

let authors = null;
let books = null;

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
type Query {
  bookCount: Int!
  authorCount: Int!
  allBooks(
  author: String
  genre: String
  ): [Book!]!
  allAuthors: [Author!]!
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
    setBornTo: Int!
  ): Author
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
  },
  Mutation: {
    addBook: async (root, args) => {
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
    // Not working at this point!
    editAuthor: (root, args) => {
      const author = Author.find({ name: args.name });
      if (!author) return null;
      const updatedAuthor = { ...author, born: args.setBornTo };
      authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));
      return updatedAuthor;
    },
  },
  Author: {
    // Not working at this point!!
    bookCount: (root) => books.filter((b) => b.author === root.name).length,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
