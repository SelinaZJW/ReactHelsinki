import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setNotification } from '../reducers/notificationReducer'
import { removeBlog, updateBlog } from '../reducers/blogReducer'
import { useParams, useNavigate } from 'react-router-dom'

const SingleBlog = ({ blogs, user }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [comment, setComment] = useState('')

  const id = useParams().id
  const blog = blogs.find(b => b.id === id)

  const handleLikes = (event) => {
    event.preventDefault()
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    //updateLikes(updatedBlog)
    dispatch(updateBlog(updatedBlog))
    dispatch(setNotification(`you liked ${blog.title}`, 'green', 5000))
  }

  const handleRemove = (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      //deleteBlog(blog.id)
      dispatch(removeBlog(blog.id))
      dispatch(setNotification(`you deleted ${blog.title}`, 'green', 5000))
      navigate('/')
    }
  }

  const removeVisibility = {
    display: (user && user.id) === (blog.user[0] && blog.user[0].id) ? '' : 'none'
    // (blog.user && user.id) === (blog.user && blog.user[0].id) ? '' : 'none'
  }

  const handleComments = (event) => {
    event.preventDefault()
    const updatedBlog = {
      ...blog,
      comments: [...blog.comments, comment]
    }
    dispatch(updateBlog(updatedBlog))
    setComment('')
  }

  return blog ? (
    <div>
      <h2>{blog.title}, by {blog.author}</h2>

      <p>{blog.url}</p>
      <p>{blog.likes} likes <button onClick={handleLikes}>like</button></p>
      <p>added by {(blog.user[0] && blog.user[0].name) || 'no user'}</p>
      <p style={removeVisibility}>
        <button id="remove-button" onClick={handleRemove}>
              remove
        </button>
      </p>

      <h3>comments:</h3>
      <input type='text' value={comment} onChange={({ target }) => setComment(target.value)} /> <button onClick={handleComments} >add comment</button>

      <ul>
        {blog.comments.map(c =>
          <li key={blog.comments.indexOf(c)}>{c}</li> )}
      </ul>
      {/* key for each c (the items in an array that's mapped) must be different */}
    </div>
  ): (
    <div>
      <p>not found</p>
    </div>
  )
}

export default SingleBlog