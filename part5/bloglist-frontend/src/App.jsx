import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setNotification({ message: `Logged in as ${user.username}` });
    } catch (exception) {
      showNotification({ message: exception.response.data.error, error: true });
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBloglistUser");
    showNotification({ message: "Successfully logged out" });
  };

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  const [notification, setNotification] = useState(null);
  const showNotification = ({ message, error }) => {
    setNotification({ message, error });
  };
  useEffect(() => {
    let timeout = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timeout);
  }, [notification]);

  return (
    <div>
      <Notification {...{ notification }} />
      {user === null ? (
        <LoginForm
          {...{
            username,
            setUsername,
            password,
            setPassword,
            handleLogin,
            showNotification,
          }}
        />
      ) : (
        <div>
          <span>{user.username} logged in </span>
          <button onClick={handleLogout}>Logout</button>
          <h2>blogs</h2>
          <BlogForm {...{ showNotification, setBlogs, blogs, user }} />
          <p></p>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                showNotification={showNotification}
                user={user}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
