import blogService from '../services/blogService'

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_BLOGS': {
    console.log(action.data)
    return action.data
  }
  case 'CREATE_BLOG': {
    return [...state, action.data]
  }
  case 'REMOVE_BLOG': {
    return action.data
  }
  case 'UPDATE': {
    return action.data
  }
  default:
    return state
  }
}

export const initializeBlogs = () => {
  return async (dispatch) =>  {
    const blogs = await blogService.getAll()
    const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

    dispatch({
      type: 'INIT_BLOGS',
      data: sortedBlogs
    })
  }
}

export const addBlog = (newBlog) => {
  return async (dispatch) => {
    const addedBlog = await blogService.create(newBlog)
    dispatch({
      type: 'CREATE_BLOG',
      data: addedBlog
    })
  }
}

export const removeBlog = (blogId) => {
  return async (dispatch) => {
    await blogService.remove(blogId)
    const blogs = await blogService.getAll()
    // var deleteIndex = blogs.findIndex((b) => b.id === blogId)
    // var array1 = [...blogs].slice(0, deleteIndex)
    // var array2 = [...blogs].slice(deleteIndex + 1)

    dispatch({
      type: 'REMOVE_BLOG',
      data: blogs,
    })
  }
}

export const updateBlog = (updatedBlog) => {
  return async (dispatch) => {
    await blogService.update(updatedBlog)
    const blogs = await blogService.getAll()
    dispatch({
      type: 'UPDATE',
      data: blogs,
    })
  }
}


export default blogReducer