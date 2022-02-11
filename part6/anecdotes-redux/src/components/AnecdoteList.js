import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { updateDisplay, voteNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    const filter = state.filter
    return state.anecdotes.filter(a => a.content.includes(filter))
  })
  const anecdotesSorted = anecdotes.sort((a, b) => b.votes - a.votes)
  const dispatch = useDispatch()

  const vote = (id, content) => {
    console.log('vote', id, content)
    dispatch(voteAnecdote(id))
    dispatch(voteNotification(content))
    setTimeout(()=> {
      dispatch(updateDisplay())
    }, 5000)
  }

  return (
    <div>
      {anecdotesSorted.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id, anecdote.content)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnecdoteList