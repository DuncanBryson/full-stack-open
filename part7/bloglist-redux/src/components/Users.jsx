import userService from "../services/users";
import { useEffect, useState } from "react";
const Users = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await userService.getUsers();
      setUsers(response);
    })();
  }, []);
  const style = {
    padding: "5px",
  };
  return (
    <div>
      <h2>Users</h2>
      <tr>
        <th scope="col"></th>
        <th scope="col">Blogs created</th>
      </tr>
      <tbody>
        {users.map((u) => (
          <tr>
            <td style={style}>{u.name}</td>
            <td>{u.blogs.length}</td>
          </tr>
        ))}
      </tbody>
    </div>
  );
};

export default Users;
