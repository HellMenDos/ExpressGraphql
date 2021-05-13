const News = require('../models/news')
const User = require('../models/user')

module.exports = {
    async getAll({to}) {
        const search = {}
        if (to) {
            search.to = to == 'ADV' ? 0 : 1
        }

        const arr = await News.findAll({where: search})

        if (global.user.news) {
            const user = await User.findByPk(global.user.id)
            user.news = 0
            await user.save()
        }

        return arr
    }
}
