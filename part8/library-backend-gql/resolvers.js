const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const jwt = require('jsonwebtoken')
require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET
const PASSWORD = process.env.PASSWORD


const resolvers = {
  Query: {
    //bookCount: () => books.length,
    bookCount: () => Book.collection.countDocuments(),
    
    //authorCount: () => authors.length,
    authorCount: () => Author.collection.countDocuments(),
    
    //allAuthors: () => authors,
    allAuthors: async () => {
      const initAuthors = await Author.find({})
      const books = await Book.find({}).populate('author')

      const authors = initAuthors.map(a => {
        const bookCount = books.filter(b => b.author.name === a.name).length
        return {name: a.name, id: a.id, born: a.born, bookCount: bookCount} 
        //better way to do this?
        //return {...a, ...bookCount}
      })
  
      return authors
    },
    // allBooks: (root, args) => {
    //   if (!args.author && !args.genre) {
    //     return books
    //   } 
    //   if (args.author) {
    //     return books.filter(b => b.author === args.author)
    //   }
    //   if (args.genre) {
    //     return books.filter(b => b.genres.includes(args.genre))
    //   }
    // },
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate('author')  //have to populate, to access full Author
      if (!args.author && !args.genre) {
        return books
      } 
      if (args.author) {
        return books.filter(b => b.author.name === args.author)
        //return await Book.find({author: args.author}).populate('author')   //might break here? author of Book is Author
      }
      if (args.genre) {
        return books.filter(b => b.genres.includes(args.genre))
        //return await Book.find({genres: args.genre}).populate('author')
      }
    }, 

    me: async (root, args, context) => {
      return context.currentUser
    }
  },
  
  // Author: {
  //   name: (root) => root.name,
  //   // bookCount: (root) => {
  //   //     return books.filter(b => b.author === root.name).length
  //   // },
  //   bookCount: async (root) => {      
  //     const books = await Book.find({}).populate('author')              // n+1 problem
  //     const authorBooks = books.filter(b => b.author.name === root.name)
  //     return authorBooks.length
  // }
  // }, 
  
  Mutation: {
    // addBook: (root, args) => {
    //   if (!authors.map(a => a.name).includes(args.author)) {
    //     const author = {name: args.author, born: null, id: uuid()}
    //     authors = authors.concat(author)
    //   }

    //   const book = {...args, id: uuid()}
    //   books = books.concat(book)
    //   return book
    // }, 
    addBook: async (root, args, context) => {
      const authors = await Author.find({})
      const author = authors.find(a => a.name === args.author)
      console.log(author)
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      if (!author) {
        const newAuthor = new Author({name: args.author, born: null})
        try {
          await newAuthor.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }

        try {
          const newBook = new Book({...args, author: newAuthor})  
          pubsub.publish('BOOK_ADDED', { bookAdded: newBook})
          return newBook.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }
        
      try {
        const newBook = new Book({...args, author: author})
        pubsub.publish('BOOK_ADDED', { bookAdded: newBook})
        return newBook.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    },
    
    // editAuthor: (root, args) => {
    //   const author = authors.find(a => a.name === args.name)
    //   if (!author) {
    //     return null
    //   }

    //   const updatedAuthor = {...author, born: args.setBornTo}
    //   authors.map(a => a.name === args.name ? updatedAuthor : a )
    //   return updatedAuthor
    // }, 
    editAuthor: async (root, args, context) => {
      const author = await Author.findOne({name: args.name})
      console.log(author._id)
      author.born = args.setBornTo

      const currentUser = context.currentUser
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      try {
        return author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    }, 

    createUser: async (root, args) => {
      const user = new User({...args})
      try {
        return user.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
    }, 
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== PASSWORD) {
        throw new UserInputError("wrong credentials")
      }

      const useForToken = {
        username: user.username,
        id: user._id,
      }
      const value = jwt.sign(useForToken, JWT_SECRET)
      return token = {value: value}
    }
  }, 

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers