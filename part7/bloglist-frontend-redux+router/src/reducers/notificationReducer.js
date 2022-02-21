const initialState = { message: '', display: 'none' }

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'SHOW_INITIAL':
    return state
  case 'SET_MESSAGE': {
    console.log(action)
    return action.data
  }
  default:
    return state
  }
}

export const setNotification = (message, color, timer) => {
  return async (dispatch) => {
    dispatch({
      type: 'SET_MESSAGE',
      data: { message: message, display: '', color: color },
    })

    setTimeout(() => {
      dispatch({
        type: 'SET_MESSAGE',
        data: { message: '', display: 'none' },
      })
    }, timer)
  }
}

export default notificationReducer
