const {buildSchema,} = require('graphql')


module.exports = buildSchema(`
  type User {
    id: ID!
    email: String
    descr: String
    token: String
    uuid: String
    name: String
    premium:String
    regDate: String
    rid: Int
    pid: String
    help: Int
    news: Int
    isAdmin: Boolean  
    avatar: String
    rating: Int
    subscribers: Int
    amISubscribed: Int
  }

  type UserBy {
    id: ID
    email: String
    name: String
    regDate: String
    avatar:String
    rating:String
    uuid:String,
    userSubs:String,
    subscribed:String
    userRating:String
    descr:String

  }  

  type Mutation {
      subscribe(id: ID): Int
      ChangeData(name:String,email:String,descr:String): String
      premiumSum(premium:String): String
  }    
  type Query {
    getUsersByPage(amount: Int, page:Int,name:String): [UserBy]
    getUserData: User!
    exit: User!    
    newPassword(password: String, oldPassword: String!): User!
  }

`)
