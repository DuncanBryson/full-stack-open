import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addLike, deleteBlog, addComment } from "../reducers/blogReducer";
import { createNotification } from "../reducers/notificationReducer";

const Blog = ({ user }) => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const handleLike = async () => {
    dispatch(addLike(blog));
  };

  const { id } = useParams();
  const blogs = useSelector((state) => state.blogs);

  if (blogs.length === 0) return null;

  const blog = blogs.find((b) => b.id === String(id));

  const showDelete =
    user.username === blog.user.username ? null : { display: "none" };

  const handleDelete = () => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog));
    }
  };

  const handleComment = (event) => {
    event.preventDefault();
    if (blog.comments.includes(comment))
      return dispatch(
        createNotification({
          message: "No duplicate comments, be original",
          error: true,
        })
      );
    dispatch(addComment(blog, comment));
    setComment("");
  };

  return (
    <div>
      <h3>
        {blog.title}, <em>{blog.author}</em>
      </h3>
      <p>
        <a href={blog.url}>{blog.url}</a>
      </p>
      <p>
        {blog.likes} likes <button onClick={handleLike}>Like</button>
      </p>
      <p>Added by {blog.user.name}</p>

      <button onClick={handleDelete} style={showDelete}>
        DELETE
      </button>
      <p></p>
      <h3>Comments</h3>
      <input
        id="comment"
        type="text"
        value={comment}
        onChange={({ target }) => setComment(target.value)}
      />
      <button type="submit" onClick={handleComment}>
        Comment
      </button>
      <ul>
        {blog.comments.map((comment) => (
          <li key={blog.comments.indexOf(comment)}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};
export default Blog;
