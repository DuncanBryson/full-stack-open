import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Blog = ({ blog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: "10px",
    backgroundColor: "white",
  };

  return (
    <div style={blogStyle} className="blog">
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> <em>{blog.author}</em>{" "}
    </div>
  );
};

const Blogs = ({ user }) => {
  const blogs = useSelector((state) => state.blogs);

  return (
    <>
      <p></p>
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} {...{ blog, user }} />
        ))}
    </>
  );
};

export default Blogs;
