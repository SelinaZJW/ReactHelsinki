import { useQuery } from '@apollo/client'
import { useState } from 'react'
import { ALL_BOOKS } from '../queries'

const Books = ({ show, books }) => {
  const [genre, setGenre] = useState(null)

  // const result = useQuery(ALL_BOOKS)
  // console.log(result.data)
  // const books = result.data ? result.data.allBooks : []  //result.data.allBooks //why can't refresh?
  
  const allGenres = books.map(b=>b.genres).flat()
  const genres = [...new Set(allGenres)]   //Set select for unique values
  console.log(genres)

  //const displayBooks = genre ? books.filter(b => b.genres.includes(genre)) : books
  const displayGenre = {
    display: genre ? '' : 'none'
  }

  const {data}  = useQuery(ALL_BOOKS, {variables: {genre: genre}})
  console.log(data)
  const displayBooks = data ? data.allBooks : []


  if (!show) {
    return null
  }

  return (
    <div>
      <h2>books</h2>

      <p style={displayGenre}>in genre <strong>{genre}</strong></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {displayBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {genres.map(g => (
        <button onClick={({target}) => setGenre(target.value)} key={g} value={g}>
          {g}
        </button>
      ))}
      <button onClick={()=> setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
