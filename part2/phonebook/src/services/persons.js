import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios
            .get(baseUrl)
            .then(reponse => reponse.data)
}

const create = (newObject) => {
  return axios
            .post(baseUrl, newObject)
            .then(reponse => reponse.data)
}

const update = (id, newObject) => {
  return axios
            .put(`${baseUrl}/${id}`, newObject)
            .then(reponse => reponse.data)
}

const remove = (id) => {
    return axios
              .delete(`${baseUrl}/${id}`)
  }

export default { getAll, create, update, remove}