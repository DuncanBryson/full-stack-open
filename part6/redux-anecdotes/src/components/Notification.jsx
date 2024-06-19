import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from "../reducers/notificationReducer";

const Notification = () => {
  const notification = useSelector((state) => state.notification);
  const dispatch = useDispatch();
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };
  useEffect(() => {
    let timeout = setTimeout(() => {
      dispatch(clearNotification());
    }, notification?.timeout * 1000);
    return () => clearTimeout(timeout);
  });
  if (notification) return <div style={style}>{notification.message}</div>;
  else return null;
};
export default Notification;
