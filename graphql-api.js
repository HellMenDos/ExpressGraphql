var graph = function(app,graphqlHTTP,giql) {

app.use('/auth', graphqlHTTP({
    schema: require('./schemas/auth'),
    rootValue: require('./resolvers/auth'),
    graphiql: giql
}))


app.use('/images', graphqlHTTP( {
    schema: require('./schemas/images'),
    rootValue: require('./resolvers/images'),
    graphiql: giql
}))


const modules = ['user', 'tickets', 'faq', 'news', 'ajax']
for (let i = 0; i < modules.length; i++) {
    app.use('/' + modules[i], graphqlHTTP({
        schema: require('./schemas/' + modules[i]),
        rootValue: require('./resolvers/' + modules[i]),
        graphiql: giql
    }))
}


}

module.exports = graph
