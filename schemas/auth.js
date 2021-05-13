const {buildSchema,} = require('graphql')


module.exports = buildSchema(`
  type User {
    id: ID
    email: String
    token: String
    uuid: String
  }
    
  type Query {
    login(email: String!, password: String!): User!
  }
  
  type Mutation {
    lostPassword(email: String!): Boolean!
    register(email: String!, password: String!, name: String!, uuid: String!): User!
    authByGoogle(userId: String, name: String, email: String, uuid: String): User!
    authByFacebook(userId: String, name: String, email: String, uuid: String): User!
  }

`)
