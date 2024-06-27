import { useDispatch, useSelector } from "react-redux";
import Togglable from "./Togglable";
import { deleteBlog, addLike } from "../reducers/blogReducer";

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch();
  const handleLike = async () => {
    dispatch(addLike(blog));
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const showDelete =
    user.username === blog.user.username ? null : { display: "none" };

  const handleDelete = () => {
    if (window.confirm(`Remove blog: ${blog.title} by ${blog.author}?`)) {
      dispatch(deleteBlog(blog));
    }
  };

  return (
    <div style={blogStyle} className="blog">
      {blog.title} <em>{blog.author}</em>{" "}
      <Togglable showLabel="view" hideLabel="hide">
        <p>{blog.url}</p>
        <p>
          Likes: {blog.likes} <button onClick={handleLike}>like</button>
        </p>
        <p>{blog.user.username}</p>
        <button onClick={handleDelete} style={showDelete}>
          DELETE
        </button>
      </Togglable>
    </div>
  );
};

const Blogs = ({ user }) => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} {...{ blog, user }} />
        ))}
    </>
  );
};

export default Blogs;
