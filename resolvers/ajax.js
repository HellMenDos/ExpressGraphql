const config = require('../config')

module.exports = {
    recPrice() {
        return config.MIN_CLICK_PRICE * 3
    }
}
