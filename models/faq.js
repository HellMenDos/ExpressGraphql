const Sequelize = require('sequelize')
const sequelize = require('../utils/db-connect')

const faq = sequelize.define('Faq', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    text: {
        type: Sequelize.TEXT,
        allowNull: false
    }
},{
    tableName: "faq",
    createdAt: false,
    updatedAt: false
})

module.exports = faq
