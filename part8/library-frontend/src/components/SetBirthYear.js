import { useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { UPDATE_AUTHOR } from "../queries"

const SetBirthYear = ({authors}) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [ updateAuthor, result ] = useMutation(UPDATE_AUTHOR)

  const handleUpdate = async (event) => {
    event.preventDefault()

    console.log(`author ${name} updated`)
    updateAuthor({ variables: {name: name, setBornTo: year}})

    setName('')
    setYear('')
  }

  console.log(result) //why is result.data not defined??? in mutation
  // useEffect(() => {
  //   if (result.data && result.data.editAuthor === null) {
  //     console.log('author not found')
  //   }
  // }, [result.data])

  return (
    <div>
      <h3>Set birthyear</h3>
      <form onSubmit={handleUpdate}>
        {/* <div>
          name
          <input value={name} onChange={({target}) => setName(target.value)} />
        </div> */}
        <select value={name} onChange={({target}) => setName(target.value)} >
          {authors.map(a => 
            <option value={a.name}>{a.name}</option>
            )}
        </select>
        <div>
          year
          <input value={year} onChange={({target}) => setYear(Number(target.value))} />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default SetBirthYear