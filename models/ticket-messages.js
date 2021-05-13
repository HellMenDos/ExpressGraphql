const Sequelize = require('sequelize')
const sequelize = require('../utils/db-connect')

const ticketMessages = sequelize.define('TicketMessages', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    uid: Sequelize.INTEGER,
    tid: Sequelize.INTEGER,
    message: Sequelize.STRING,
    date: Sequelize.DATE,
}, {
    tableName: "tickets_messages",
    createdAt: false,
    updatedAt: false
})

module.exports = ticketMessages
