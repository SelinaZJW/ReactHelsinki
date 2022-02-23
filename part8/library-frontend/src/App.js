import { useEffect, useState } from 'react'
import { useQuery, useApolloClient } from '@apollo/client'
import { ALL_BOOKS } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)

  const result = useQuery(ALL_BOOKS)
  console.log(result.data)
  const books = result.data ? result.data.allBooks : []

  useEffect(() => {
    const loggedInToken = localStorage.getItem('library-user-token')
    console.log(loggedInToken)
    setToken(loggedInToken)
  }, [])

  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('login')
  }

  const loggedInDisplay = token ? '' : 'none'
  const loggedOutDisplay = token ? 'none' : ''

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')} style={({display: loggedOutDisplay})}>login</button>

        <button onClick={() => setPage('add')} style={({display: loggedInDisplay})} >add book</button>
        <button onClick={() => setPage('recommend')} style={({display: loggedInDisplay})}>recommend</button>
        <button onClick={logout} style={({display: loggedInDisplay})}>logout</button>
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} books={books}/>

      <NewBook show={page === 'add'} />

      <Login show={page ==='login'} setToken={setToken} setPage={setPage} />

      <Recommend show={page ==='recommend'} books={books} />
    </div>
  )
}

export default App
