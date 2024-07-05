import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { LOGIN } from "../queries";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setToken, setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const redirect = useNavigate();
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      alert(error.graphQLErrors[0].message);
    },
  });
  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      localStorage.setItem("library-user-token", token);
      localStorage.setItem("library-user-username", username);
      setToken(token);
      setUser(username);
      redirect("/");
    }
  }, [result.data]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    login({ variables: { username, password } });
  };
  return (
    <div className="loginform">
      <form onSubmit={handleSubmit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
