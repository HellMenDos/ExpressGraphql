const Faq = require('../models/faq')

module.exports = {
  async getAll() {
    const arr = await Faq.findAll()
    return arr
  }
}
