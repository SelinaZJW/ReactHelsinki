const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const likesArray = blogs.map(b => b.likes)
  const reducer = (a, b) => {
    return a + b
  }
  
  return likesArray.length === 0 
    ? 0
    : likesArray.reduce(reducer, 0)

}

const favouriteBlog = (blogs) => {
  const likesArray = blogs.map(b => b.likes)
  const mostLikes = Math.max(...likesArray)
  const favouriteBlog =  blogs.find(b => b.likes === mostLikes)
  console.log(favouriteBlog)
  
  return likesArray.length === 0
  ? {}
  :
  {
    title: favouriteBlog.title,
    author: favouriteBlog.author,
    likes: favouriteBlog.likes
  }
}

const mostBlogs = (blogs) => {
  const list = _.countBy(blogs, 'author')
  const authors = Object.keys(list)
  const blogsNumber = Object.values(list)
  const maxBlogs = Math.max(...blogsNumber)
  const maxAuthor = authors[blogsNumber.indexOf(maxBlogs)]

  return blogs.length === 0 
  ? {}
  : {
    author: maxAuthor,
    blogs: maxBlogs
  }
}

const mostLikes = (blogs) => {
  const list = _.groupBy(blogs, 'author')
  const authors = Object.keys(list)
  const eachBlog = Object.values(list)
  const likesArray = eachBlog.map(a => a.map(b=> b.likes))
  console.log(likesArray)
  console.log(authors)
  
  const likesTotal = likesArray.map(l => _.sum(l))
  console.log(likesTotal)
  const maxLikes = Math.max(...likesTotal)
  const maxAuthor = authors[likesTotal.indexOf(maxLikes)]  

  return blogs.length === 0 
  ? {}
  : {
    author: maxAuthor,
    likes: maxLikes
  }

}

module.exports = {
  dummy, 
  totalLikes, 
  favouriteBlog,
  mostBlogs, 
  mostLikes
}


// const palindrome = (string) => {
//     return string
//       .split('')
//       .reverse()
//       .join('')
//   }
  
//   const average = (array) => {
//     const reducer = (sum, item) => {
//       return sum + item
//     }
  
//     return array.length === 0
//     ? 0
//     : array.reduce(reducer, 0) / array.length
//   }
  
//   module.exports = {
//     palindrome,
//     average,
//   }