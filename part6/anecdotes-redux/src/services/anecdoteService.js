import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createNew = async (content) => {
  const newA = {content, votes: 0}
  const response = await axios.post(baseUrl, newA)
  return response.data
}

const updateVote = async (id) => {
  const votedA = await axios.get(`${baseUrl}/${id}`)
  const updateA = {...votedA.data, votes: votedA.data.votes +1}
  const response = await axios.put(`${baseUrl}/${id}`, updateA)
  console.log(response.data)
  return response.data
}

export default { getAll, createNew, updateVote }