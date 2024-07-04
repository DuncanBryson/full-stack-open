import { useQuery } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { BrowserRouter as Router, Link, Routes, Route } from "react-router-dom";
import { ALL_AUTHORS, ALL_BOOKS } from "./queries";

const App = () => {
  const authorsResult = useQuery(ALL_AUTHORS);
  const booksResult = useQuery(ALL_BOOKS);
  if (authorsResult.loading || booksResult.loading) return null;
  const authors = authorsResult.data.allAuthors;
  const books = booksResult.data.allBooks;
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
          <Link to="/add">
            <button>Add Book</button>
          </Link>
        </div>
        <Routes>
          <Route path="/authors" element={<Authors authors={authors} />} />
          <Route path="/" element={<Books books={books} />} />
          <Route path="/add" element={<NewBook />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
