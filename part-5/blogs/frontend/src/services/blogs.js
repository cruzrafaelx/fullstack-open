import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (extractedToken) => {
     token = `Bearer ${extractedToken}`
}

const getAll = async () => {
    const config = token ? {headers: { Authorization: token }} : {} 
    const response = await axios.get(baseUrl, config)
    return response.data
}

const create = async (blog) => {
    const config = token ? {headers: { Authorization: token }} : {} 
    const response = await axios.post(baseUrl, blog, config)
    return response.data
}

export default { getAll, setToken, create }