import Togglable from "./Togglable";
import blogService from "../services/blogs";
import { useState } from "react";

const Blog = ({ blog }) => {
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

  return (
    <div style={blogStyle}>
      {blog.title} <em>{blog.author}</em>{" "}
      <Togglable showLabel="view" hideLabel="hide">
        <p>{blog.url}</p>
        <p>
          {likes} <button onClick={addLike}>like</button>
        </p>
        <p>{blog.user.username}</p>
      </Togglable>
    </div>
  );
};

export default Blog;
