import loginService from '../services/loginService'
import blogService from '../services/blogService'

const loginReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_USER': {
    console.log(action)
    return action.data
  }
  case 'UNSET_USER': {
    return state = null
  }
  default:
    return state
  }
}

export const initUser = () => {
  return async (dispatch) => {
    // retrieve user from session storage
    // parse json
    // put in redux
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    const user = JSON.parse(loggedUserJSON)
    if (user !== null) {
      blogService.setToken(user.token)
    }

    dispatch({
      type: 'SET_USER',
      data: user
    })
  }
}

export const loginUser = (username, password) => {
  return async (dispatch) => {
    const user = await loginService.login({ username, password })
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
    blogService.setToken(user.token)

    dispatch({
      type: 'SET_USER',
      data: user
    })
  }
}

export const logoutUser = () => {
  return async (dispatch) => {
    window.localStorage.removeItem('loggedBlogappUser')
    dispatch({
      type: 'UNSET_USER'
    })
  }
}

export default loginReducer