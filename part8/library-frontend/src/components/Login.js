import { useState, useEffect } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { LOGIN, ME } from "../queries"

const Login = ({ show, setToken, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [ login, {data} ] = useMutation(LOGIN, {    //data, not result.data
    refetchQueries: ({query: ME}), //why refetch not working??? so that recommend can work
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    }, 
    // update: (cache, response) => {
    //   cache.updateQuery({query: ME} , ({ me }) => {
    //     console.log(response.data)
    //   })
    // }
  })

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log(`${username} logging in`)

    login({variables: {username: username, password: password}})

    setUsername('')
    setPassword('')

    //window.location.reload()
    setPage('authors')
  }

  useEffect(() => {
    if ( data ) {
      const token = data.login.value
      console.log(`token: ${token}`)
      
      setToken(token)
      localStorage.setItem('library-user-token', token)
    }
  }, [data])


  if (!show) {
      return null
    }


  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          username <input value={username} onChange={({ target }) => setUsername(target.value)} />
        </div>
        <div>
          password <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default Login