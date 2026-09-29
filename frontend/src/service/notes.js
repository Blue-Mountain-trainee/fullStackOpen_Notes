import axios from 'axios'
const baseUrl = '/api/notes'

const extractDataFrom = (req) => req.then(res => res.data)

const getAll = () => {
    const req = axios.get(baseUrl)
    return extractDataFrom(req)
}

const create = newObject => {
    const req = axios.post(baseUrl, newObject)
    return extractDataFrom(req)
}

const update = (id, newObject) => {
    const req = axios.put(`${baseUrl}/${id}`, newObject)
    return extractDataFrom(req)
}

export default { 
  getAll, 
  create, 
  update 
}