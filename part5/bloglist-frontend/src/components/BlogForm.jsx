import { useState, useRef } from "react";
import blogService from "../services/blogs";
import Togglable from "./Togglable";

const Form = ({ showNotification, setBlogs, blogs, user }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();
    try {
      const newBlog = await blogService.create({ title, author, url });
      newBlog.user = user;
      setBlogs(blogs.concat(newBlog));
      showNotification({ message: `New Blog ${title} by ${author} added` });
      blogFormRef.current.toggleVisibility();
    } catch (error) {
      showNotification({ message: error.response.data.error, error: true });
    }
  };

  const blogFormRef = useRef();

  return (
    <div>
      <Togglable showLabel="New Blog" hideLabel="Cancel" ref={blogFormRef}>
        <h2>Create New Blog</h2>
        <form onSubmit={addBlog}>
          <div>
            <label htmlFor="title">Title: </label>
            <input
              id="title"
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="author">Author: </label>
            <input
              id="author"
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            ></input>
          </div>
          <div>
            <label htmlFor="url">URL: </label>
            <input
              id="url"
              type="url"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            ></input>
          </div>
          <button type="submit">Add Blog</button>
        </form>
      </Togglable>
    </div>
  );
};

export default Form;
