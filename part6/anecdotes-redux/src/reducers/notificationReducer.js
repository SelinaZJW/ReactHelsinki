const initialState = {message: '', display: 'none'}

const notificationReducer = (state = initialState, action) => {
    // eslint-disable-next-line default-case
    switch (action.type) {
        case 'SHOW_INITIAL':
            return state
        case 'SET_MESSAGE': {
            console.log(action)
            return action.data
        }
        // case 'NEW_ANECDOTE': {
        //     const anecdote = action.data.content
        //     return `you created new anecdote '${anecdote}'`
        // }
        case 'SET_DISPLAY': {
          return action.data
        }
        default:
            return state
    }
}

export const voteNotification = (content) => {
   const msg = `you voted '${content}'`

    return {
      type: 'SET_MESSAGE',
      data: {message: msg, display: ''}
    }
  }

export const createNotification = (content) => {
    const msg = `you created '${content}'`
    return {
      type: 'SET_MESSAGE',
      data: {message: msg, display: ''}
    }
  }

export const setNotification = (message, timer) => {
  return async dispatch => {
    dispatch({
      type: 'SET_MESSAGE', 
      data: {message: message, display: ''}
    })
    setTimeout(()=> {
      dispatch({
        type: 'SET_MESSAGE', 
        data: {message: '', display: 'none'}
      })
    }, timer)
  }
}

export const updateDisplay = () => {
  
    return {
      type: 'SET_DISPLAY',
      data: {message: '', display: 'none'}
    }
  }

export default notificationReducer