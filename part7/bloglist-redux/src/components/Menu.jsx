import { Link } from "react-router-dom";

const style = {
  paddingRight: 5,
};
const Menu = () => (
  <span>
    <Link style={style} to="/">
      Blogs
    </Link>
    <Link style={style} to="/users">
      Users
    </Link>
  </span>
);

export default Menu;
