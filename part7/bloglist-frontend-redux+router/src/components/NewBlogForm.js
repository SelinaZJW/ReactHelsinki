import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { addBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

const NewBlogForm = () => {
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleNewBlog = (event) => {
    event.preventDefault()
    const newBlog = {
      title: title,
      author: author,
      url: url,
    }
    console.log(newBlog)

    //createBlog(newBlog)
    dispatch(addBlog(newBlog))
    dispatch(setNotification(`a new blog ${newBlog.title} by ${newBlog.author} is added`, 'green', 5000))

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new blog</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          title:
          <input
            id="title"
            type="text"
            value={title}
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id="author"
            type="text"
            value={author}
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id="url"
            type="url"
            value={url}
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id="create-button" type="submit">
          create
        </button>
      </form>
    </div>
  )
}

export default NewBlogForm
