import { useEffect } from "react"
const Notification = ({notification, setNotification}) => {
  const style = {
    color: "green",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }


  if (notification === null) {
    return null
  } else {
    if (notification.error) style.color = "red"
      return(
        <div className='notification' style={style}>
          {notification.message}
        </div>
      )
  }
 
}

export default Notification