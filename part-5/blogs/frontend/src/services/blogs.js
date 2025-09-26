import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (extractedToken) => {
     token = `Bearer ${extractedToken}`
     console.log(token)
}

const getAll = async () => {
    const config = token ? {headers: { Authorization: token }} : {} 
    console.log(config)
    const response = await axios.get(baseUrl, config)
    return response.data
}

export default { getAll, setToken }