require('dotenv').config()
// var mysql = require('mysql2/promise')
const {Sequelize} = require("sequelize")
const initModels = require("./models/init-models")

// create connection to db
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
});

  // sequelize.showAllSchemas

const models = initModels(sequelize)
module.exports = {models, sequelize}
// var connection = mysql.createPool({
//   host: 'geng115.myweb.cs.uwindsor.ca',
//   user: 'geng115_db',
//   password: 'password',
//   database: 'geng115_db',
//   waitForConnections: true
// })

// connection.connect()

// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  //   if (err) throw err
  
  //   console.log('The solution is: ', rows[0].solution)
  // })
  
  // connection.end()