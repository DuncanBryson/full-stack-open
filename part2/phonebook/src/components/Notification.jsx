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
  if (notification.includes("Error")) style.color = "red"

  if (notification === '') {
    return null
  } else {
    useEffect(()=>{
      const timeout = setTimeout(()=>{
        setNotification('')
      },5000)
      return () => clearTimeout(timeout)
    })

    return (
      <div className='notification' style={style}>
        {notification}
      </div>
    )
  }
 
}

export default Notification