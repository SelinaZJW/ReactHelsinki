import React from 'react'
import { Link } from 'react-router-dom'

const Menu = ({ user, handleLogout }) => {
  const padding = {
    padding: 5
  }

  return (
    <div style={{ padding: 8, background: 'rgb(220,220,220)' }}>
      <Link style={padding} to="/">blogs</Link>
      <Link style={padding} to="/users">users</Link>
      {user
        ?
        <span style={padding}>
          <span>{user.name} is logged in</span>  <button id="logout-button" onClick={handleLogout}>logout</button>
        </span>
        : <span></span>
      }
    </div>
  )
}

export default Menu