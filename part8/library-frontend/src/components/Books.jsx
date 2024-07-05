import { useState } from "react";
const Books = ({ books }) => {
  const [selectedGenre, setSelectedGenre] = useState(false);
  const allGenres = [];
  books.map((b) =>
    b.genres.map((g) => {
      allGenres.includes(g) ? null : allGenres.push(g);
    })
  );
  const hidden = selectedGenre ? {} : { display: "none" };
  return (
    <div>
      <h2>books</h2>
      <p style={hidden}>
        In genre <em>{selectedGenre}</em>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => {
            if (selectedGenre && !b.genres.includes(selectedGenre)) return null;
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
        <button key={g} onClick={() => setSelectedGenre(g)}>
          {g}
        </button>
      ))}
      <button onClick={() => setSelectedGenre(false)}>All Genres</button>
    </div>
  );
};

export default Books;
