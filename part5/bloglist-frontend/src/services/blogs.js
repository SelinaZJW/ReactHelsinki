import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

let token = null

const setToken = newToken => {
  token = `bearer ${newToken}`
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  console.log(response)
  return response.data
}

const update = async (id, update) => {

  const response = await axios.put(`${baseUrl}/${id}`, update)
  console.log(response)
  return response.data

}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  console.log(response)
  return response.data
}

export default { getAll, setToken, create, update, remove }