const Sequelize = require('sequelize')
const sequelize = require('../utils/db-connect')

const contentModeration = sequelize.define('ContentModeration', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    uid: Sequelize.INTEGER,
    path: Sequelize.STRING,
    title: Sequelize.STRING,
    date: Sequelize.DATE
}, {
    tableName: "contentModeration",
    createdAt: false,
    updatedAt: false
})

module.exports = contentModeration
