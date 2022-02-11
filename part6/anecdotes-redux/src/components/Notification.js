import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(state => state.notification.message)
  const display = useSelector(state => state.notification.display)
  // if (notification !== '') {
  //   setDisplay('')
  //   setTimeout(()=> {
  //     setDisplay('none')
  //   }, 2000)
  // }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    display: display
  }
  return (
    <div style={style}  >
      {notification}
    </div>
  )
}

export default Notification