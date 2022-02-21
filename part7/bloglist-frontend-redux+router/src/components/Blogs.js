import React from 'react'
// import { useDispatch } from 'react-redux'
// import { setNotification } from '../reducers/notificationReducer'
// import { removeBlog, likeBlog } from '../reducers/blogReducer'
import { Link } from 'react-router-dom'

const Blogs = ({ blogs }) => {

  // const dispatch = useDispatch()

  // const [detailsVisible, setDetailsVisible] = useState(false)
  // const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  // const showWhenVisible = { display: detailsVisible ? '' : 'none' }

  // const toggleVisibility = () => {
  //   setDetailsVisible(!detailsVisible)
  // }

  // const handleUpdate = (event) => {
  //   event.preventDefault()
  //   const updatedBlog = {
  //     ...blog,
  //     likes: blog.likes + 1,
  //   }
  //   //updateLikes(updatedBlog)
  //   dispatch(likeBlog(updatedBlog))
  //   dispatch(setNotification(`you liked ${blog.title}`, 'green', 5000))
  // }

  // const handleRemove = (event) => {
  //   event.preventDefault()
  //   if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
  //     //deleteBlog(blog.id)
  //     dispatch(removeBlog(blog.id))
  //     dispatch(setNotification(`you deleted ${blog.title}`, 'green', 5000))
  //   }
  // }

  // const removeVisibility = {
  //   display: blog.user[0] && user.id === blog.user[0].id ? '' : 'none',
  // }

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 4,
    paddingBottom: 3,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      {blogs.map(blog => (
        <div style={blogStyle} key={blog.id}>
          <Link to={`/blogs/${blog.id}`}>{blog.title}, by {blog.author} </Link>
        </div>
      ))}
    </div>
  )
}

export default Blogs
