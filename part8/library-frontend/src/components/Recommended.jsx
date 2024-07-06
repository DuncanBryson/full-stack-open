const Recommended = ({ user, books }) => {
  if (!user) return null;
  const genre = user.favoriteGenre;
  return (
    <div>
      <h2>Recommendations:</h2>
      <p>
        Books in your favourite genre <em>{genre}</em>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((b) => {
            if (!b.genres.includes(genre)) return null;
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
    </div>
  );
};

export default Recommended;
