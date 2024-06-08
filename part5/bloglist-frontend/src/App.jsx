import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
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
    } catch (exception) {
      console.log("Wrong Credentials");
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBloglistUser");
  };

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  return (
    <div>
      {user === null ? (
        <LoginForm
          {...{ username, setUsername, password, setPassword, handleLogin }}
        />
      ) : (
        <div>
          <span>{user.username} logged in </span>
          <button onClick={handleLogout}>Logout</button>
          <h2>blogs</h2>
          <BlogForm />
          <p></p>
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
