const {buildSchema} = require('graphql')

module.exports = buildSchema(`
  type Image {
    id: ID
    uid: ID
    path: String
    title: String
    rating: Int
    userName: String
    userRating: String
    userSubs: Int
    userAvatar: String
    seenthis: Int
    subscribed: Int
    contentType: Int
    comments: Int
  }
    
  type Event{
    id: ID
    uid: Int
    target: Int
    type: String
    fromUser: String
    toUser: String
    date: String
  }
  type Comment{
    id: ID
    parentId: Int
    uid: Int
    fromUserName: String
    toUser: String
    toUserName: String
    contentId: Int
    message: String
    date: String
  }  
  
  type User {
    id: ID!
    email: String
    token: String
    uuid: String
    name: String
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

  type Query {
    getNewImages(offsetId: ID, showVideo: Boolean, onlySubs: Boolean): [Image]
    getNewImagesByUser(uid: Int!, offsetId: ID): [Image]
    getBestImages(offset: Int, showVideo: Boolean, onlySubs: Boolean): [Image]
    getSavedImages(offset: Int, uid: String): [Image]
    getCommentsByContent(contentId: ID!): [Comment] 
    getUser(uid: Int!): User!
    getUserEvents(uid: ID!): [Event]
    getCommentsByUid(uid: ID!): [Comment]
    getContentById(contentId: ID!): Image
  }
  
  type Mutation {
    addRating(id: ID!, rating: Int, uuid: String): Image,
    addToSave(id: ID!, uid: String!): Image
    delFromSave(id: ID!, uid: String): String
    deleteImage(id: ID!): String
    seenImages(id: ID!): String
    subscribe(id: ID!): Int   
    subscribeToUser(uid: ID!): Int
    addComment(contentId: ID!, message: String!, parentId: Int, toUser: Int): Int
  }

`)
