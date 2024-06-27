import { useState, useRef } from "react";
import Togglable from "./Togglable";
import { createBlog } from "../reducers/blogReducer";
import { useDispatch } from "react-redux";

const Form = ({ user }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const dispatch = useDispatch();
  const blogFormRef = useRef();

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(createBlog({ title, author, url }, user, blogFormRef));
  };

  return (
    <div>
      <Togglable showLabel="New Blog" hideLabel="Cancel" ref={blogFormRef}>
        <h2>Create New Blog</h2>
        <form onSubmit={handleSubmit}>
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
