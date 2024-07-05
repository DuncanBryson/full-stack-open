import { useApolloClient, useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import { ALL_AUTHORS, ALL_BOOKS, CURRENT_USER } from "./queries";
import { useEffect, useState } from "react";
import LoginForm from "./components/LoginForm";

const App = () => {
  const [user, setUser] = useState(
    localStorage.getItem("library-user-username")
  );
  const [token, setToken] = useState(
    localStorage.getItem("library-user-token")
  );

  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  const currentUserResult = useQuery(CURRENT_USER);
  const client = useApolloClient();

  if (authorsResult.loading || booksResult.loading || currentUserResult.loading)
    return null;
  const authors = authorsResult.data.allAuthors;
  const books = booksResult.data.allBooks;
  const handleLogout = () => {
    setUser(null);
    setToken(null);
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
            <Link to="/add">
              <button>Add Book</button>
              <button onClick={handleLogout}>Logout</button>
            </Link>
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
        </Routes>
      </div>
    </Router>
  );
};

export default App;
