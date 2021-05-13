const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  enum Status{
    active
    disabled
  }
  
  type Query {
    changeCampStatus(id: Int!): Status!
    changeAdStatus(id: Int!): Status!
    minPrice: Float!
    recPrice: Float!
  }

`)
