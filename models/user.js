const Sequelize = require('sequelize')
const sequelize = require('../utils/db-connect')

const user = sequelize.define('User', {
    id: {
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING(64),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    token: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true
    },
    uuid: {
        type: Sequelize.STRING(128),
        allowNull: false,
        unique: true
    },
    name: Sequelize.STRING(32),
    descr: Sequelize.STRING(225),
    premium: Sequelize.STRING(10),
    avatar: Sequelize.STRING(56),
    regDate: Sequelize.DATE,
    rid: Sequelize.INTEGER,
    pid: Sequelize.STRING(32),
    help: Sequelize.INTEGER,
    news: Sequelize.INTEGER,
    googleUserId: Sequelize.STRING(64),
    rating: Sequelize.INTEGER,

}, {
    tableName: "users",
    createdAt: false,
    updatedAt: false
})

module.exports = user
