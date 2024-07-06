import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Recommended = ({ user }) => {
  if (!user) return null;
  const genre = user.favoriteGenre;
  const booksResult = useQuery(ALL_BOOKS, { variables: { genre } });
  if (booksResult.loading) return null;
  const books = booksResult.data.allBooks;

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
