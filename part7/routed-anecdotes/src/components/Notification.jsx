import { useEffect } from "react";

const Notification = ({ notification, setNotification }) => {
  useEffect(() => {
    let timeout = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timeout);
  });
  const style = {
    borderStyle: "solid",
  };
  if (notification) return <div style={style}>{notification}</div>;
  return null;
};
export default Notification;
