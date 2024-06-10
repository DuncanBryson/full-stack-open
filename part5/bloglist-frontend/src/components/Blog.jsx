import Togglable from "./Togglable";
import blogService from "../services/blogs";
import { useState } from "react";

const Blog = ({ blog, showNotification, user }) => {
  const addLike = async () => {
    try {
      const response = await blogService.addLike(blog.id, {
        likes: likes + 1,
      });
      setLikes(response.likes);
    } catch (exception) {
      console.log(exception);
    }
  };

  const [likes, setLikes] = useState(blog.likes);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showDelete =
    user.username === blog.user.username ? null : { display: "none" };

  const handleDelete = async () => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}?`))
      try {
        await blogService.remove(blog.id);
        showNotification({ message: `${blog.title} deleted` });
        blogStyle.display = "none";
      } catch (exception) {
        showNotification({
          message: exception.response.data.error,
          error: true,
        });
      }
  };

  return (
    <div style={blogStyle}>
      {blog.title} <em>{blog.author}</em>{" "}
      <Togglable showLabel="view" hideLabel="hide">
        <p>{blog.url}</p>
        <p>
          {likes} <button onClick={addLike}>like</button>
        </p>
        <p>{blog.user.username}</p>
        <button onClick={handleDelete} style={showDelete}>
          DELETE
        </button>
      </Togglable>
    </div>
  );
};

export default Blog;
