const session = require('express-session')
const redis = require('redis')
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()

var redfile = function(app,config) {

app.use(session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient })
}))

}

module.exports = redfile
