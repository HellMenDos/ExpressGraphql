const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type Ticket {
    id: ID!
    uid: Int
    name: String
    status: Int
    date: String
    new: Int
  }
  
  type Message {
    id: ID!
    uid: Int!
    tid: Int!
    message: String!
    date: String!
  }
  
  enum Status{
    OPEN
    CLOSED
  }
  
  type Query {
    getAll: [Ticket!]!
    getOne(tid: Int!): Ticket!
    addTicket(name: String!, message: String!): Ticket!
    getMessages(tid: Int!): [Message!]!
    changeStatus(tid: Int!): Ticket!
    addMessage(tid: Int!, message: String!): Message!
  }

`)
