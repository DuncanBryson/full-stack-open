import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = ({ authors }) => {
  const [hidden, setHiden] = useState({ display: "none" });
  const [author, setAuthor] = useState(null);
  const [newYear, setNewYear] = useState("");

  const handleChange = (event) => {
    setHiden({ display: true });
    setAuthor(event.target.value);
  };

  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });
  const handleSubmit = (event) => {
    console.log("submitting", author, newYear);
    editAuthor({ variables: { name: author, setBornTo: Number(newYear) } });
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
              <td>
                <button onClick={handleChange} value={a.name}>
                  Update Author
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={hidden}>
        <h3>Update birth year for {author}</h3>
        <input
          value={newYear}
          onChange={({ target }) => setNewYear(target.value)}
        ></input>
        <button onClick={handleSubmit}>Submit</button>
        <button>Cancel</button>
      </div>
    </div>
  );
};

export default Authors;
