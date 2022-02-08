import React, { useState } from 'react'

const Blog = ({ blog, user, updateLikes, deleteBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)
  const hideWhenVisible = { display: detailsVisible ? 'none' : '' }
  const showWhenVisible = { display: detailsVisible ? '' : 'none' }

  const toggleVisibility = () => {
    setDetailsVisible(!detailsVisible)
  }

  const handleUpdate = async (event) => {
    event.preventDefault()
    const updatedBlog = {
      ...blog,
      likes: blog.likes +1
    }
    updateLikes(updatedBlog)
  }

  // useEffect(() => {
  //   window.alert(JSON.stringify(user, null, 2))
  // }, [user])

  const handleRemove = async (event) => {
    event.preventDefault()
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  // const removeVisibility = useMemo(() => {
  //    const vis = (user && blog.user[0] && user.id === blog.user[0].id) ? '' : 'none'

  //    return {display: vis}

  //   // return {display: (blog.user[0] && user.id === blog.user[0].id) ? '': 'none'}
  // }, [user])

  const removeVisibility = { display: (blog.user !==[] && user.id === blog.user[0].id) ? '': 'none' }
  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 4,
    paddingBottom: 3,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='blogDefault'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
      </div>

      <div style= {showWhenVisible} className='blogDetails'>
        <ul>
          <li>{blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button></li>
          <li>{blog.url}</li>
          <li>likes: {blog.likes} <button onClick={handleUpdate}>like</button></li>
          <li>{blog.user[0] && blog.user[0].name || 'no user' }</li>
          <li style={removeVisibility}><button onClick={handleRemove} >remove</button></li>
        </ul>
      </div>
    </div>
  )
}

export default Blog