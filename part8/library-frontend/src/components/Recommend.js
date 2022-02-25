import { useQuery } from "@apollo/client"
import { ME } from "../queries"

const Recommend = ({ show, books }) => {
  const result = useQuery(ME)
  const me = result.data ? result.data.me : []
  console.log("me", me)
  const favoriteGenre = me? me.favoriteGenre : []

  const recommendedBooks = books.filter(b => b.genres.includes(favoriteGenre))


  if (!show) {
    return null
  }

  return (
    <div>
      <h2>recommendations</h2>
      <p>books in your favourite genre <strong>{favoriteGenre}</strong></p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>

          {recommendedBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}

        </tbody>
      </table>
    </div>
    
  )
}

export default Recommend