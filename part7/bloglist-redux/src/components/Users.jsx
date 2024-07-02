import { Link } from "react-router-dom";

const Users = ({ users }) => (
  <table>
    <caption
      style={{
        fontWeight: "bold",
        fontSize: "1.5em",
        textAlign: "left",
      }}
    >
      Users
    </caption>
    <thead>
      <tr>
        <th scope="col"></th>
        <th scope="col">Blogs created</th>
      </tr>
    </thead>
    <tbody>
      {users.map((u) => (
        <tr key={u.id}>
          <td style={{ padding: "5px" }}>
            <Link to={`/users/${u.id}`}>{u.name}</Link>
          </td>
          <td>{u.blogs.length}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default Users;
