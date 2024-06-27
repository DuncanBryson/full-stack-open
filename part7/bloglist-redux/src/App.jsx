import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { createNotification } from "./reducers/notificationReducer";
import { useDispatch } from "react-redux";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      dispatch(
        createNotification({ message: `Logged in as ${user.username}` })
      );
    } catch (exception) {
      dispatch(
        createNotification({
          message: exception.response.data.error,
          error: true,
        })
      );
    }
  };

  const handleLogout = () => {
    setUser(null);
    window.localStorage.removeItem("loggedBloglistUser");
    dispatch(createNotification({ message: "Successfully logged out" }));
  };

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);
  const addLike = async (blog, likes) => {
    try {
      const response = await blogService.addLike(blog.id, {
        likes: likes + 1,
      });
      return response;
    } catch (exception) {
      console.log(exception);
    }
  };

  const deleteBlog = async (blog) => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}?`))
      try {
        await blogService.remove(blog.id);
        dispatch(createNotification({ message: `${blog.title} deleted` }));
        const newBlogs = blogs.filter((b) => b.id !== blog.id);
        setBlogs(newBlogs);
      } catch (exception) {
        dispatch(
          createNotification({
            message: exception.response.data.error,
            error: true,
          })
        );
      }
  };

  const blogFormRef = useRef();
  const addBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject);
      newBlog.user = user;
      setBlogs(blogs.concat(newBlog));
      dispatch(
        createNotification({
          message: `New Blog ${blogObject.title} by ${blogObject.author} added`,
        })
      );
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      dispatch(
        createNotification({ message: error.response.data.error, error: true })
      );
    }
  };

  return (
    <div>
      <Notification />
      {user === null ? (
        <LoginForm
          {...{
            username,
            setUsername,
            password,
            setPassword,
            handleLogin,
          }}
        />
      ) : (
        <div>
          <span>{user.username} logged in </span>
          <button onClick={handleLogout}>Logout</button>
          <h2>blogs</h2>
          <BlogForm {...{ addBlog, blogFormRef }} />
          <p></p>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog key={blog.id} {...{ deleteBlog, addLike, user, blog }} />
            ))}
        </div>
      )}
    </div>
  );
};

export default App;
