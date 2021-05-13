const Sequelize = require('sequelize')
const sequelize = require('../utils/db-connect')

const news = sequelize.define('News', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    title: Sequelize.STRING,
    text: Sequelize.TEXT,
    date: {
        type: Sequelize.DATE,
        allowNull: false
    },
    to: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
}, {
    tableName: "news",
    createdAt: false,
    updatedAt: false
})

module.exports = news
