import React from 'react'
//import { useSelector } from 'react-redux'
import { connect } from 'react-redux'

const Notification = (props) => {
  // const notification = useSelector(state => state.notification.message)
  // const display = useSelector(state => state.notification.display)
  
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
    display: props.notification.display
  }
  return (
    <div style={style}  >
      {props.notification.message}
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    notification: state.notification
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification