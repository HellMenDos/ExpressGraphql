const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type News {
    id: ID!
    title: String!
    text: String!
    date: String
    to: Int
  }
  
  type Query {
    getAll(to: String): [News!]!
  }

`)
