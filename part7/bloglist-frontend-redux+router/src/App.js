import React, { useState, useEffect } from 'react'
import Blogs from './components/Blogs'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import UserTable from './components/UserTable'
import SingleUser from './components/SingleUser'
import SingleBlog from './components/SingleBlog'
import Menu from './components/Menu'
// import blogService from './services/blogService'
// import loginService  from './services/loginService'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { initUser, loginUser, logoutUser } from './reducers/loginReducer'
import { initializeUsers } from './reducers/userReducer'
import { useSelector, useDispatch } from 'react-redux'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'


const App = () => {
  //const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  //const [user, setUser] = useState(null)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    // blogService
    //   .getAll()
    //   .then((blogs) => blogs.sort((a, b) => b.likes - a.likes))
    //   .then((blogs) => setBlogs(blogs))
    dispatch(initializeBlogs())
    dispatch(initUser())
    dispatch(initializeUsers())
  }, [])

  const blogs = useSelector(state => state.blog)
  const user = useSelector(state => state.login)
  const users = useSelector(state => state.users)
  // const user = JSON.parse(savedUser)
  console.log(user)

  // useEffect(() => {
  //   // const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
  //   // if (loggedUserJSON) {
  //   //   const user = JSON.parse(loggedUserJSON)
  //   //   setUser(user)
  //   //   blogService.setToken(user.token)
  //   // }
  // }, [])



  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)

    try {
      // const user = await loginService.login({
      //   username,
      //   password,
      // })
      // window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      // console.log(user)
      // setUser(user)
      //blogService.setToken(user.token)

      dispatch(loginUser(username, password))
      setUsername('')
      setPassword('')
      navigate('/')
    } catch (exception) {
      console.log('wrong credentials', exception)
      dispatch(setNotification('wrong username or password', 'red', 5000))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    //window.localStorage.removeItem('loggedBlogappUser')
    dispatch(logoutUser())
    // window.location.reload()
    navigate('/')
  }


  // const createBlog = async (newBlog) => {
  //   dispatch(addBlog(newBlog))

  //   // const addedBlog = await blogService.create(newBlog)
  //   // setBlogs([addedBlog, ...blogs])

  //   dispatch(setNotification(`a new blog ${newBlog.title} by ${newBlog.author} is added`, 'green', 5000))

  //   // setMessage(`a new blog ${addedBlog.title} by ${addedBlog.author} is added`)
  //   // setTimeout(() => {
  //   //   setMessage(null)
  //   // }, 5000)
  // }

  // const updateLikes = async (updatedBlog) => {
  //   // await blogService.update(updatedBlog.id, updatedBlog)

  //   // var updateIndex = blogs.findIndex((b) => b.id === updatedBlog.id)

  //   // const newBlogs = [...blogs]
  //   // newBlogs[updateIndex] = updatedBlog
  //   // setBlogs(newBlogs)

  //   //dispatch(likeBlog(updatedBlog))
  // }

  // const deleteBlog = async (blogId) => {
  //   // await blogService.remove(blogId)
  //   // var deleteIndex = blogs.findIndex((b) => b.id === blogId)
  //   // var array1 = [...blogs].slice(0, deleteIndex)
  //   // var array2 = [...blogs].slice(deleteIndex + 1)
  //   // setBlogs(array1.concat(array2))

  //   //dispatch(removeBlog(blogId))
  // }

  return (
    <div>
      {user === null ? (
        <div>
          <h2>log into application</h2>
          <Notification />
          <LoginForm
            handleLogin={handleLogin}
            username={username}
            setUsername={setUsername}
            password={password}
            setPassword={setPassword}
          />
        </div>
      ) : (
        <div>
          <Menu user={user} handleLogout={handleLogout} />
          <h2>blog app</h2>
          <Notification  />
          {/* <p>
            {user.name} is logged in{' '}
            <button id="logout-button" onClick={handleLogout}>
              logout
            </button>
          </p> */}

          {/* <Togglable buttonLabel="create new blog">
            <NewBlogForm  />
          </Togglable> */}

          {/* <UserTable users={users} /> */}

          {/* <Blogs blogs={blogs} /> */}
        </div>
      )}

      <Routes>
        <Route path="/" element={
          user ?
            (<div>
              <Togglable buttonLabel="create new blog">
                <NewBlogForm  />
              </Togglable>
              <Blogs blogs={blogs} />
            </div>)
            : <div></div>}
        />
        <Route path="/users" element={user ? <UserTable users={users} /> : <Navigate replace to="/"/>} />
        <Route path="/users/:id" element={ user ? <SingleUser users={users} /> : <Navigate replace to="/"/>} />
        <Route path="/blogs/:id" element={ user ? <SingleBlog blogs={blogs} user={user} /> : <Navigate replace to="/"/> } />
      </Routes>
    </div>
  )
}

export default App
