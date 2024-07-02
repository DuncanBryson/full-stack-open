import { useEffect, useState } from "react";
import Blogs from "./components/Blogs";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Users from "./components/Users";
import UserBlogs from "./components/UserBlogs";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import Menu from "./components/menu";
import blogService from "./services/blogs";
import loginService from "./services/login";
import userService from "./services/users";
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
  const [users, setUsers] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await userService.getUsers();
      setUsers(response);
    })();
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
    <div id="body">
      <Router>
        <Notification />
        {user === null ? (
          <LoginForm {...{ loginAs }} />
        ) : (
          <div className="content">
            <Menu {...{ user, logout, dispatch }} />
            <div className="header">
              <h2>Blogs</h2>
              <BlogForm {...{ user }} />
            </div>

            <div className="main">
              <Routes>
                <Route path="/" element={<Blogs {...{ user }} />} />
                <Route path="/users" element={<Users {...{ users }} />} />
                <Route
                  path="/users/:id"
                  element={<UserBlogs {...{ users }} />}
                />
                <Route path="/blogs/:id" element={<Blog {...{ user }} />} />
              </Routes>
            </div>
          </div>
        )}
      </Router>
    </div>
  );
};

export default App;
