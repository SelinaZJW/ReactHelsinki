import React from 'react'
import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification.message)
  const display = useSelector(state => state.notification.display)
  const color = useSelector(state => state.notification.color)

  const style = {
    display: display,
    color: color
  }

  return (
    <div style={style} className="notification" >
      {notification}
    </div>
  //   message && (
  //     <h3 className="notification" style={{ color: `${color}` }}>
  //       {message}
  //     </h3>
  //   )
  )
}

export default Notification
