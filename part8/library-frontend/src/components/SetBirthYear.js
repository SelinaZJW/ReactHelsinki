import { useState, useEffect } from "react"
import { mergeOptions, useMutation } from "@apollo/client"
import { UPDATE_AUTHOR } from "../queries"

const SetBirthYear = ({authors}) => {
  const [name, setName] = useState('')
  const [year, setYear] = useState('')

  const [ updateAuthor, {data} ] = useMutation(UPDATE_AUTHOR)

  const handleUpdate = async (event) => {
    event.preventDefault()

    console.log(`author ${name} updated`)
    updateAuthor({ variables: {name: name, setBornTo: year}})

    setName('')
    setYear('')
  }

  console.log(data) //why is result.data not defined??? in mutation, 
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
        <select value={mergeOptions.value} onChange={({target}) => setName(target.value)} >
          <option>find author</option>
          {authors.map(a => 
            <option key={a.id} value={a.name} >{a.name}</option>
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