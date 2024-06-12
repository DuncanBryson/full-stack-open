import Togglable from "./Togglable";
import { useState } from "react";

const Blog = ({ blog, user, addLike, deleteBlog }) => {
  const handleLike = async () => {
    const response = await addLike(blog, likes);
    setLikes(response.likes);
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

  const handleDelete = () => deleteBlog(blog);

  return (
    <div style={blogStyle}>
      {blog.title} <em>{blog.author}</em>{" "}
      <Togglable showLabel="view" hideLabel="hide">
        <p>{blog.url}</p>
        <p>
          Likes: {likes} <button onClick={handleLike}>like</button>
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
