import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = ({ authors, user }) => {
  const [author, setAuthor] = useState(null);
  const [newYear, setNewYear] = useState("");
  const hidden = user ? { display: true } : { display: "none" };

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const handleSubmit = (event) => {
    editAuthor({
      variables: {
        name: author,
        setBornTo: newYear.length === 0 ? undefined : Number(newYear),
      },
    });
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={hidden}>
        <h3>Update author</h3>
        <label htmlFor="Year">Birth Year</label>
        <input
          id="Year"
          value={newYear}
          onChange={({ target }) => setNewYear(target.value)}
        ></input>
        <select onChange={({ target }) => setAuthor(target.value)} key="select">
          {authors.map((a) => (
            <option key={a.name}>{a.name}</option>
          ))}
        </select>
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default Authors;
