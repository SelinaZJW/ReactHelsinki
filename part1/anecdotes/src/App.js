import React, { useState, useMemo } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>
      {text}
    </button>
  )
}

const DisplayQuote = ({anecdote}) => {
  return (
    <p>{anecdote}</p>
  )
}

const DisplayVotes = ({votesNumber}) => {
  return (
    <p>has {votesNumber} votes</p>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
   
  const [selected, setSelected] = useState(0)
  const getRandomQ = (max) => {
    return (
      Math.floor(Math.random() * max)
      )
  }
  const nextQuote = () => {
    setSelected(getRandomQ(anecdotes.length))
  }

  const [votes, setVotes] = useState(new Uint8Array(anecdotes.length))
  //const [votes, setVotes] = useState({})   --> if votes is empty object

  //const [mostVotes, setMax] = useState(0)  --> won't work if original votes are loaded fronm server
  //const [mostVotes, setMax] = useState(votes.indexOf(Math.max(...votes)))  --> quick fix

  const mostVotes = useMemo(
    () => {
      const max = Math.max(...votes)
      return votes.indexOf(max)

      // const max = Math.max(...Object.values(votes))
      // return Object.keys(votes).find(sel => votes[sel] === max);
    },
    [votes]     //--> update in reference to votes, 
  )

  const voteQuote = () => {
    const votesCopy = [...votes]
    votesCopy[selected] += 1
    setVotes(votesCopy)

    // setVotes({
      // ...votes,
      // [selected]: votes[selected] + 1 || 1    --> start with empty object, if empty, then 1
    // })

    // const max = Math.max(...votes)    --> only update mostVotes when clicking vote
    // setMax(votes.indexOf(max))   
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <DisplayQuote anecdote={anecdotes[selected]}/>
      <DisplayVotes votesNumber={votes[selected]} />
      <Button onClick={voteQuote} text='vote'/>
      <Button onClick={nextQuote} text='next quote'/>
      <h1>Anecdote with the most votes</h1>
      <DisplayQuote anecdote={anecdotes[mostVotes]}/>
      <DisplayVotes votesNumber={votes[mostVotes]} />
    </div>
  )
}

export default App