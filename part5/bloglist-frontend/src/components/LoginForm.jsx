import { PropTypes } from "prop-types";

const LoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  handleLogin,
}) => (
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

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};
export default LoginForm;
