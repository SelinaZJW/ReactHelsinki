import { useEffect, useState } from 'react'
import { useQuery, useSubscription, useApolloClient, } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}


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

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      console.log(subscriptionData)
      const addedBook = subscriptionData.data.bookAdded 
      const author = subscriptionData.data.bookAdded.author

      // client.cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
      //   return {
      //     allBooks: allBooks.concat(addedBook),
      //   }
      // })
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)   //why not update for Books component query?
      //updateCache(client.cache, { query: ALL_AUTHORS }, author) //how to update for author too? when author is not already there
      window.alert(`a new book ${addedBook.title} is added`)
    }
  })

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
