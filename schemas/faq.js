const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type Help {
    id: ID!
    title: String!
    text: String!
  }
  
  type Query {
    getAll: [Help!]!
  }

`)
