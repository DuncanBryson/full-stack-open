import Togglable from "./Togglable";
const Blog = ({ blog }) => {
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
          {blog.likes} <button>like</button>
        </p>
        <p>{blog.author}</p>
      </Togglable>
    </div>
  );
};

export default Blog;
