import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  //const [newBlog, setNewBlog] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  // const [title, setTitle] = useState('')
  // const [author, setAuthor] = useState('')
  // const [url, setUrl] = useState('')
  const [message, setMessage] = useState(null)
  const [color, setColor] = useState('green')

  useEffect(() => {
    blogService
      .getAll()
      .then(blogs => blogs.sort((a, b) => a.likes - b.likes))
      .then(blogs => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      console.log(user)
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log('wrong credentials')
      setMessage('wrong username or password')
      setColor('red')
      setTimeout(() => {
        setMessage(null)
        setColor('green')
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedBlogappUser')
    window.location.reload()
  }

  // const loginForm = () => {
  //   return <form onSubmit={handleLogin}>
  //       <div>
  //         username
  //           <input
  //           type="text"
  //           value={username}
  //           name="Username"
  //           onChange={({ target }) => setUsername(target.value)}
  //         />
  //       </div>
  //       <div>
  //         password
  //           <input
  //           type="password"
  //           value={password}
  //           name="Password"
  //           onChange={({ target }) => setPassword(target.value)}
  //         />
  //       </div>
  //       <button type="submit">login</button>
  //     </form>
  // }

  // const blogForm = () => (
  //   <form onSubmit={addBlog}>
  //     <input
  //       value={newBlog}
  //       onChange={handleBlogChange}
  //     />
  //     <button type="submit">save</button>
  //   </form>
  // )

  // const handleNewBlog = async (event) => {
  //   event.preventDefault()
  //   const newBlog = {
  //       title: title,
  //       author: author,
  //       url: url
  //   }
  //   console.log(newBlog)

  //   try {
  //       const addedBlog = await blogService.create(newBlog)
  //       setBlogs(blogs.concat(addedBlog))
  //       setTitle('')
  //       setAuthor('')
  //       setUrl('')
  //       setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} is added`)
  //       setTimeout(() => {
  //         setMessage(null)
  //       }, 5000)

  //   } catch {
  //     console.log('error')
  //   }
  // }

  const createBlog = async (newBlog) => {
    const addedBlog = await blogService.create(newBlog)
    // setBlogs(blogs.concat(addedBlog))
    setBlogs([addedBlog, ...blogs])
    setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} is added`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const updateLikes = async (updatedBlog) => {
    await blogService.update(updatedBlog.id, updatedBlog)

    var updateIndex = blogs.findIndex(b => b.id === updatedBlog.id)

    const newBlogs = [...blogs]
    newBlogs[updateIndex] = updatedBlog
    setBlogs(newBlogs)
  }

  const deleteBlog = async (blogId) => {
    await blogService.remove(blogId)
    var deleteIndex = blogs.findIndex(b => b.id===blogId)
    var array1 = [...blogs].slice(0,deleteIndex)
    var array2 = [...blogs].slice(deleteIndex+1)
    setBlogs(array1.concat(array2))

  }

  return (
    <div>
      {user === null ?
        <div>
          <h2>log into application</h2>
          <Notification message={message} color={color}/>
          <LoginForm handleLogin={handleLogin} username ={username} setUsername={setUsername} password={password} setPassword={setPassword} />
        </div>
        :
        <div>
          <h2>blogs</h2>
          <Notification message={message} color={color} />
          <p>{user.name} is logged in <button onClick={handleLogout}>logout</button> </p>

          <Togglable buttonLabel='create new blog' >
            <NewBlogForm  createBlog={createBlog} />
          </Togglable>

          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} user={user} updateLikes={updateLikes} deleteBlog={deleteBlog}/> )}
        </div>
      }




    </div>

  )
}

export default App