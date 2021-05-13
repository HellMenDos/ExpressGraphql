var view = function(app,exphbs) {
const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: {
        ifeq: require('./utils/hbs-helpers'),
        dateFormat: require('handlebars-dateformat')
    }
})
app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', 'views')

}

module.exports = view


