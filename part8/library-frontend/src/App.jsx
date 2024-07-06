import { useApolloClient, useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import { ALL_AUTHORS, ALL_BOOKS, CURRENT_USER } from "./queries";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";
import Recommended from "./components/Recommended";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );
  const [user, setUser] = useState(null);
  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const currentUserResult = useQuery(CURRENT_USER, {
    skip: !token,
  });
  const client = useApolloClient();
  useEffect(() => {
    if (currentUserResult.data?.me) {
      setUser(currentUserResult.data.me);
    }
  }, [currentUserResult, token]);

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
