import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";
const Books = ({ books }) => {
  const [genre, setGenre] = useState();
  const allGenres = [];
  const bookResults = useQuery(ALL_BOOKS, { variables: { genre } });
  if (bookResults.loading) return null;
  const filteredbooks = bookResults.data.allBooks;

  books.map((b) =>
    b.genres.map((g) => {
      allGenres.includes(g) ? null : allGenres.push(g);
    })
  );

  const hidden = genre ? {} : { display: "none" };

  return (
    <div>
      <h2>books</h2>
      <p style={hidden}>
        In genre <em>{genre}</em>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {filteredbooks.map((b) => {
            // previous solution using state instead of a query
            // if (genre && !b.genres.includes(genre)) return null;
            return (
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {allGenres.map((g) => (
        <button key={g} onClick={() => setGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setGenre()}>All Genres</button>
    </div>
  );
};

export default Books;
