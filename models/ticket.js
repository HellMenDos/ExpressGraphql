const Sequelize = require('sequelize')
const sequelize = require('../utils/db-connect')

const ticket = sequelize.define('Ticket', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    uid: Sequelize.INTEGER,
    name: Sequelize.STRING,
    status: Sequelize.INTEGER,
    date: Sequelize.DATE,
    new: Sequelize.INTEGER
}, {
    tableName: "tickets",
    createdAt: false,
    updatedAt: false
})

module.exports = ticket
