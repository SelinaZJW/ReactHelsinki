import { useQuery } from '@apollo/client'
import { ALL_AUTHORS } from '../queries'
import SetBirthYear from './SetBirthYear'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  console.log(result.data)
  const authors = result.data.allAuthors
  
  if (!props.show) {
    return null
  }

  return (
    <div>
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div>
        <SetBirthYear authors={authors} />
      </div>
      
    </div>
  )
}

export default Authors
