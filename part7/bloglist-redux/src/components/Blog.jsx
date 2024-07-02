import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addLike, deleteBlog } from "../reducers/blogReducer";

const Blog = ({ user }) => {
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
    </div>
  );
};
export default Blog;
