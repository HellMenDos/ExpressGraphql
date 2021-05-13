const Sequelize = require('sequelize')
const sequelize = require('../utils/db-connect')

const saved = sequelize.define('Saved', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    uid: Sequelize.INTEGER,
    imageId: Sequelize.INTEGER,
}, {
    tableName: "saved",
    createdAt: false,
    updatedAt: false
})

module.exports = saved
