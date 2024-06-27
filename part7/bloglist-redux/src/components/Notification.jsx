import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from "../reducers/notificationReducer";

const Notification = () => {
  const style = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  };
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  useEffect(() => {
    let timeout = setTimeout(() => {
      dispatch(clearNotification());
    }, 5000);
    return () => clearTimeout(timeout);
  });
  if (notification === null) return null;

  if (notification.error) style.color = "red";
  return (
    <div className="notification" style={style}>
      {notification.message}
    </div>
  );
};

export default Notification;
