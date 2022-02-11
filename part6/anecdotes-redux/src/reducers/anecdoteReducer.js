import anecdoteService from "../services/anecdoteService"
// import { useDispatch } from "react-redux"

// const dispatch = useDispatch()
// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = (anecdote) => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

const anecdoteReducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)

  // eslint-disable-next-line default-case
  switch(action.type) {
    case 'VOTE': {
      const id = action.data.id
      const anecdoteToVote = state.find(a => a.id === id)
      const votedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }

      return state.map(a => a.id !== id ? a : votedAnecdote )
    }
    case 'NEW_ANECDOTE': {
      return [...state, action.data]
    }
    case 'INIT_ANECDOTE': {
      return action.data
    }
    default:
    return state
  } 
}

export const voteAnecdote = (id) => {
  return async dispatch => {
    const updateA = await anecdoteService.updateVote(id)
    dispatch({
      type: 'VOTE',
      data: updateA
    })
  } 
}

export const createAnecdote = (content) => {
  return async dispatch => {
    const newA = await anecdoteService.createNew(content)
    dispatch ({
      type: 'NEW_ANECDOTE', 
      data: newA
    })
  }
}

export const initializeAnecdote = () => {
  return async dispatch =>  {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTE', 
      data: anecdotes
    })
  } 
}
export default anecdoteReducer