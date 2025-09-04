import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/phonebook'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(res => res.data)
}

const addNew = (person) => {
    const request = axios.post(baseUrl, person)
    return request.then(res => res.data)
}

const removePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    request.catch(error => alert("This note is already deleted!"))
}

const changeNum = (id, obj) => {
    const request = axios.put(`${baseUrl}/${id}`, obj)
    return request.then(res => res.data)
}


export default { getAll, addNew, removePerson, changeNum }