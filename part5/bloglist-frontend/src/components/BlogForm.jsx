import { useState } from "react";
import blogService from "../services/blogs";

const Form = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const addBlog = () => {
    blogService.create({ title, author, url });
  };
  return (
    <div>
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
    </div>
  );
};

export default Form;
