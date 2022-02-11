import React from 'react'
import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { createNotification, updateDisplay } from '../reducers/notificationReducer'
//import anecdoteService from '../services/anecdoteService'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createNotification(content))

    //const newA = await anecdoteService.createNew(content)
    dispatch(createAnecdote(content))
    
    setTimeout(()=> {
      dispatch(updateDisplay())
    }, 5000)
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

export default AnecdoteForm