import { gql } from "@apollo/client";

const BOOK_INFO = gql`
  fragment BookInfo on Book {
    title
    published
    genres
    author {
      name
    }
  }
`;
export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query ($genre: String) {
    allBooks(genre: $genre) {
      ...BookInfo
    }
  }
  ${BOOK_INFO}
`;

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      ...BookInfo
    }
  }
  ${BOOK_INFO}
`;

export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
    }
  }
`;

export const CURRENT_USER = gql`
  query {
    me {
      username
      favoriteGenre
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookInfo
    }
  }
  ${BOOK_INFO}
`;
