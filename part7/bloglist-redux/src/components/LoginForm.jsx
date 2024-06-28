import { PropTypes } from "prop-types";
import { useState } from "react";

const LoginForm = ({ loginAs }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (event) => {
    event.preventDefault();
    loginAs(username, password);
    setUsername("");
    setPassword("");
  };
  return (
    <form onSubmit={handleLogin}>
      <label htmlFor="username">Username</label>
      <input
        id="username"
        type="text"
        value={username}
        name="Username"
        onChange={({ target }) => setUsername(target.value)}
      ></input>
      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        name="Password"
        onChange={({ target }) => setPassword(target.value)}
      ></input>
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
