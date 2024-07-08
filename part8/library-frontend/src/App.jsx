import { useApolloClient, useQuery, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED, CURRENT_USER } from "./queries";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";

const App = () => {
  const client = useApolloClient();
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  const [user, setUser] = useState(null);
  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const currentUserResult = useQuery(CURRENT_USER, {
    skip: !token,
  });

  useEffect(() => {
    if (currentUserResult.data?.me) {
      setUser(currentUserResult.data.me);
    }
  }, [currentUserResult, token]);
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const newBook = data.data.bookAdded;
      alert(`Book added: ${newBook.title} by ${newBook.author.name}`);
      const genres = newBook.genres;
      for (const genre of genres) {
        client.cache.updateQuery(
          { query: ALL_BOOKS, variables: { genre } },
          ({ allBooks }) => {
            return {
              allBooks: allBooks.concat(newBook),
            };
          }
        );
      }
      client.refetchQueries({ include: [ALL_AUTHORS, ALL_BOOKS] });
    },
  });

  if (authorsResult.loading || booksResult.loading || currentUserResult.loading)
    return null;
  const authors = authorsResult.data.allAuthors;
  const books = booksResult.data.allBooks;
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.clear();
    client.resetStore();
  };
  return (
    <Router>
      <div>
        <div>
          <Link to="/authors">
            <button>Authors</button>
          </Link>
          <Link to="/">
            <button>Books</button>
          </Link>
          {user ? (
            <>
              <Link to="/add">
                <button>Add Book</button>
              </Link>
              <Link to="/recommended">
                <button>Recommended</button>
              </Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login">
              <button>Login</button>
            </Link>
          )}
        </div>
        <Routes>
          <Route path="/authors" element={<Authors {...{ authors, user }} />} />
          <Route path="/" element={<Books books={books} />} />
          <Route path="/add" element={<NewBook />} />
          <Route
            path="/login"
            element={<LoginForm {...{ setToken, setUser }} />}
          />
          <Route
            path="/recommended"
            element={<Recommended {...{ books, user }} />}
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
