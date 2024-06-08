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
      type="text"
      value={password}
      name="Password"
      onChange={({ target }) => setPassword(target.value)}
    ></input>
    <button type="submit">Login</button>
  </form>
);
export default LoginForm;
