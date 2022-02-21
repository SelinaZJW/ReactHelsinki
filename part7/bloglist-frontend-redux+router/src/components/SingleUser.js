import React from 'react'
import { useParams } from 'react-router-dom'

const SingleUser = ({ users }) => {
  const id = useParams().id
  console.log('id', id)
  console.log('users', users)
  const user = users.find(u => u.id === id)
  console.log('user', user)

  return user ? (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs:</h3>
      <ul>
        {user.blogs.map(blog => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  ): (
    <div>
      <p>not found</p>
    </div>
  )
}

export default SingleUser