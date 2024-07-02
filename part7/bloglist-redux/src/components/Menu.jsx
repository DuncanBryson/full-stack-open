import { Link } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiNote, mdiAccountGroup, mdiLogout } from "@mdi/js";

const style = {
  paddingRight: 5,
};

const Menu = ({ user, logout, dispatch }) => (
  <div id="menubar">
    <h2>Menu</h2>
    <ul className="links">
      <li key="blogs">
        <Link style={style} to="/">
          <Icon path={mdiNote} size={1} />
          <span>Blogs</span>
        </Link>
      </li>
      <li key="users">
        <Link style={style} to="/users">
          <Icon path={mdiAccountGroup} size={1} />
          <span>Users</span>
        </Link>
      </li>
    </ul>
    <p>{`${user.username} `}logged in</p>
    <p className="logout">
      <a onClick={() => dispatch(logout())}>
        <Icon path={mdiLogout} size={1} />
        <span>Logout</span>
      </a>
    </p>
  </div>
);

export default Menu;
