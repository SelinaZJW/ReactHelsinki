import React from 'react'

const Notification = ({ message, color }) => {
  return message && (
    <h3 className = 'notification' style={{ color: `${color}` }} >{message}</h3>
  )
}

export default Notification