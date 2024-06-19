import {
  useNotificationDispatch,
  useNotificationValue,
} from "../NotificationContext";
import { useEffect } from "react";
const Notification = () => {
  const notification = useNotificationValue();
  const dispatch = useNotificationDispatch();
  useEffect(() => {
    let timeout = setTimeout(() => {
      dispatch({ type: "CLEAR" });
    }, 5000);
    return () => clearTimeout(timeout);
  });
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  if (!notification) return null;

  return <div style={style}>{notification}</div>;
};

export default Notification;
