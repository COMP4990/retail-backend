require('dotenv').config()
// var mysql = require('mysql2/promise')
const { Sequelize,QueryTypes } = require("sequelize")
const initModels = require("./models/init-models")


// create connection to db
const dw_sequelize = new Sequelize(process.env.DW_NAME, process.env.DW_USERNAME, process.env.DW_PASSWORD, {
    host: process.env.DW_HOST,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

// sequelize.showAllSchemas

const dw_models = initModels(dw_sequelize)
dw_sequelize.sync()
module.exports = { dw_models, dw_sequelize,QueryTypes }