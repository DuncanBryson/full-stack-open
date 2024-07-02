import { useParams } from "react-router-dom";
const UserBlogs = ({ users }) => {
  const { id } = useParams();
  const user = users.find((u) => u.id === String(id));

  if (user)
    return (
      <>
        <h2>{user.name}</h2>
        <h3>Added Blogs</h3>
        <ul>
          {user.blogs.map((blog) => (
            <li key={blog.id}>{blog.title}</li>
          ))}
        </ul>
      </>
    );
  else return null;
};

export default UserBlogs;
