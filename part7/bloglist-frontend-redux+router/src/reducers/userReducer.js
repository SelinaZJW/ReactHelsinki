import userService from '../services/userService'

const userReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USERS': {
    return action.data
  }
  case 'SINGLE_USER': {
    return action.data
  }
  default:
    return state
  }
}

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await userService.getAll()
    dispatch({
      type: 'INIT_USERS',
      data: users
    })
  }
}

export const singleUser = (id) => {
  return async (dispatch) => {
    const user = await userService.getOne(id)
    dispatch({
      type: 'SINGLE_USER',
      data: user
    })
  }
}

export default userReducer