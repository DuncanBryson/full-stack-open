import { useEffect } from "react";
import Blogs from "./components/Blogs";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Users from "./components/Users";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { createNotification } from "./reducers/notificationReducer";
import { useDispatch, useSelector } from "react-redux";
import { initializeBlogs } from "./reducers/blogReducer";
import { updateUser, logout } from "./reducers/userReducer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(initializeBlogs());
  }, []);

  const user = useSelector((state) => state.user);

  const loginAs = async (username, password) => {
    try {
      const newUser = await loginService.login({ username, password });
      window.localStorage.setItem(
        "loggedBloglistUser",
        JSON.stringify(newUser)
      );
      blogService.setToken(newUser.token);
      dispatch(updateUser(newUser));
      dispatch(
        createNotification({ message: `Logged in as ${newUser.username}` })
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

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUser) {
      const user = JSON.parse(loggedUser);
      dispatch(updateUser(user));

      blogService.setToken(user.token);
    }
  }, []);

  return (
    <Router>
      <Notification />
      {user === null ? (
        <LoginForm {...{ loginAs }} />
      ) : (
        <div>
          <span>{user.username} logged in </span>
          <button onClick={() => dispatch(logout())}>Logout</button>
          <h2>blogs</h2>
          <Routes>
            <Route path="/" element={<Blogs {...{ user }} />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      )}
    </Router>
  );
};

export default App;