const Sequelize = require('sequelize')
const sequelize = require('../utils/db-connect')

const images = sequelize.define('Images', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    path: Sequelize.STRING,
    title: Sequelize.STRING,
    rating: Sequelize.INTEGER,
    uid: Sequelize.INTEGER,
    date: Sequelize.DATE,
    contentType: Sequelize.INTEGER
}, {
    tableName: "images",
    createdAt: false,
    updatedAt: false
})

module.exports = images
