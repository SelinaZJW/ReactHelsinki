// const { ApolloServer, UserInputError, gql } = require('apollo-server')
// const Author = require('./models/author')
// const Book = require('./models/book')
const User = require('./models/user')
// const { v1: uuid } = require('uuid')
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const express = require('express')
const http = require('http')

const jwt = require('jsonwebtoken')

const mongoose = require('mongoose')
require('dotenv').config()
const typeDefs = require('./schema')
const resolvers = require('./resolvers')


const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET
// const PASSWORD = process.env.PASSWORD

console.log('connecting to', MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '',
    }
  )

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET)
        const currentUser = await User.findById(decodedToken.id)
        
        return { currentUser }
      }
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }), 
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            },
          }
        },
      },
    ],
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/',
  })

  const PORT = 4000

  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}


start()

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'Fyodor Dostoevsky',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   { 
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   { 
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]

/*
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
*/

// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },  
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and punishment',
//     published: 1866,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'The Demon ',
//     published: 1872,
//     author: 'Fyodor Dostoevsky',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

// const typeDefs = gql`
//   type Author {
//     name: String!
//     bookCount: Int
//     born: Int
//     id: ID!
//   }
//   type Book {
//     title: String!
//     published: Int!
//     author: Author!
//     genres: [String!]!
//     id: ID!
//   }
  
//   type User {
//     username: String!
//     favoriteGenre: String!
//     id: ID!
//   }
//   type Token {
//     value: String!
//   }

//   type Query {
//     bookCount: Int!
//     authorCount: Int!
//     allAuthors: [Author!]!
//     allBooks(author: String, genre: String): [Book!]!
//     me: User
//   }

//   type Mutation {
//     addBook (
//       title: String!
//       published: Int!
//       author: String!
//       genres: [String!]!
//     ) : Book
//     editAuthor (
//       name: String!
//       setBornTo: Int!
//     ) : Author
//     createUser(
//       username: String!
//       favoriteGenre: String!
//     ): User
//     login(
//       username: String!
//       password: String!
//     ): Token
//   }
// `

// const resolvers = {
//   Query: {
//     //bookCount: () => books.length,
//     bookCount: () => Book.collection.countDocuments(),
    
//     //authorCount: () => authors.length,
//     authorCount: () => Author.collection.countDocuments(),
    
//     //allAuthors: () => authors,
//     allAuthors: async () => await Author.find({}), 
    
//     // allBooks: (root, args) => {
//     //   if (!args.author && !args.genre) {
//     //     return books
//     //   } 
//     //   if (args.author) {
//     //     return books.filter(b => b.author === args.author)
//     //   }
//     //   if (args.genre) {
//     //     return books.filter(b => b.genres.includes(args.genre))
//     //   }
//     // },
//     allBooks: async (root, args) => {
//       const books = await Book.find({}).populate('author')  //have to populate, to access full Author
//       if (!args.author && !args.genre) {
//         return books
//       } 
//       if (args.author) {
//         return books.filter(b => b.author.name === args.author)
//         //return await Book.find({author: args.author}).populate('author')   //might break here? author of Book is Author
//       }
//       if (args.genre) {
//         return books.filter(b => b.genres.includes(args.genre))
//         //return await Book.find({genres: args.genre}).populate('author')
//       }
//     }, 

//     me: async (root, args, context) => {
//       return context.currentUser
//     }
//   },
  
//   Author: {
//     name: (root) => root.name,
//     // bookCount: (root) => {
//     //     return books.filter(b => b.author === root.name).length
//     // },
//     bookCount: async (root) => {
//       const books = await Book.find({}).populate('author')
//       const authorBooks = books.filter(b => b.author.name === root.name)
//       return authorBooks.length
//   }
//   }, 
  
//   Mutation: {
//     // addBook: (root, args) => {
//     //   if (!authors.map(a => a.name).includes(args.author)) {
//     //     const author = {name: args.author, born: null, id: uuid()}
//     //     authors = authors.concat(author)
//     //   }

//     //   const book = {...args, id: uuid()}
//     //   books = books.concat(book)
//     //   return book
//     // }, 
//     addBook: async (root, args, context) => {
//       const authors = await Author.find({})
//       const author = authors.find(a => a.name === args.author)
//       console.log(author)
//       const currentUser = context.currentUser

//       if (!currentUser) {
//         throw new AuthenticationError("not authenticated")
//       }

//       if (!author) {
//         const newAuthor = new Author({name: args.author, born: null})
//         try {
//           await newAuthor.save()
//         } catch (error) {
//           throw new UserInputError(error.message, {
//             invalidArgs: args,
//           })
//         }

//         try {
//           const newBook = new Book({...args, author: newAuthor})  
//           return newBook.save()
//         } catch (error) {
//           throw new UserInputError(error.message, {
//             invalidArgs: args,
//           })
//         }
//       }
        
//       try {
//         const newBook = new Book({...args, author: author})
//         return newBook.save()
//       } catch (error) {
//         throw new UserInputError(error.message, {
//           invalidArgs: args,
//         })
//       }
//     },
    
//     // editAuthor: (root, args) => {
//     //   const author = authors.find(a => a.name === args.name)
//     //   if (!author) {
//     //     return null
//     //   }

//     //   const updatedAuthor = {...author, born: args.setBornTo}
//     //   authors.map(a => a.name === args.name ? updatedAuthor : a )
//     //   return updatedAuthor
//     // }, 
//     editAuthor: async (root, args, context) => {
//       const author = await Author.findOne({name: args.name})
//       console.log(author._id)
//       author.born = args.setBornTo

//       const currentUser = context.currentUser
//       if (!currentUser) {
//         throw new AuthenticationError("not authenticated")
//       }

//       try {
//         return author.save()
//       } catch (error) {
//         throw new UserInputError(error.message, {
//           invalidArgs: args,
//         })
//       }
//     }, 

//     createUser: async (root, args) => {
//       const user = new User({...args})
//       try {
//         return user.save()
//       } catch (error) {
//         throw new UserInputError(error.message, {
//           invalidArgs: args,
//         })
//       }
//     }, 
//     login: async (root, args) => {
//       const user = await User.findOne({ username: args.username })
//       if (!user || args.password !== PASSWORD) {
//         throw new UserInputError("wrong credentials")
//       }

//       const useForToken = {
//         username: user.username,
//         id: user._id,
//       }
//       const value = jwt.sign(useForToken, JWT_SECRET)
//       return token = {value: value}
//     }
//   }
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context: async ({ req }) => {
//     const auth = req ? req.headers.authorization : null
//     if (auth && auth.toLowerCase().startsWith('bearer ')) {
//       const decodedToken = jwt.verify(
//         auth.substring(7), JWT_SECRET
//       )
//       const currentUser = await User.findById(decodedToken.id)
//       return { currentUser }
//     }
//   }
// })

// server.listen().then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// })