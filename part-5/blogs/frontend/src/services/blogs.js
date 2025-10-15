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

const like = async (id, updatedBlog) => {
    const config = token ? {headers : { Authorization: token }} : {}
    const blogUrl = `${baseUrl}/${id}`
    const response = await axios.put(blogUrl, updatedBlog, config)
    return response.data
}

const remove = async (id) => {
    const config = token ? {headers : { Authorization: token }} : {}
    const blogUrl = `${baseUrl}/${id}`
    await axios.delete(blogUrl, config)
}

export default { getAll, setToken, create, like, remove }