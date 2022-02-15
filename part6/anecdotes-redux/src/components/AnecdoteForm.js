import React from 'react'
import { useDispatch } from 'react-redux'
import { connect } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
//import { createNotification, updateDisplay } from '../reducers/notificationReducer'
import { setNotification } from '../reducers/notificationReducer'
//import anecdoteService from '../services/anecdoteService'


const AnecdoteForm = (props) => {
  //const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    
    //const newA = await anecdoteService.createNew(content)
    //dispatch(createAnecdote(content))
    props.createAnecdote(content)
    
    // dispatch(createNotification(content))
    // setTimeout(()=> {
    //   dispatch(updateDisplay())
    // }, 5000)
    //dispatch(setNotification(`you created a new anecdote '${content}'`, 5000))
    props.setNotification(`you created a new anecdote '${content}'`, 5000)
  }

  return (
      <div>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
            <div><input name='anecdote' /></div>
            <button>create</button>
        </form>
      </div>
  )
}

//export default AnecdoteForm
export default connect(
  null, 
  { createAnecdote, setNotification }
)(AnecdoteForm)