const lodash = require('lodash')


const dummy = (blogs) => {
    return 1
}

const sumOfLikes = (blogs) => {

    const totalLikes = blogs.reduce((acc, blog) => {
        
        return acc + blog.likes
    }, 0)

    return totalLikes
}

const favoriteBlog = (blogs) => {
    
    if(blogs.length === 0) return null

    const faveBlog = blogs.reduce((max, blog) => {
            return blog.likes > max.likes ? blog : max
    })

    return faveBlog
}

const mostBlogs = (blogs) => {

    const mostLike = lodash.maxBy(blogs, 'blogs')
    return {author: mostLike.author, blogs: mostLike.blogs}

}


const mostLikes = (blogs) => {

    const mostLike = lodash.maxBy(blogs, 'likes')
    return {author: mostLike.author, likes: mostLike.likes}

}

module.exports = { dummy, sumOfLikes, favoriteBlog, mostBlogs, mostLikes }