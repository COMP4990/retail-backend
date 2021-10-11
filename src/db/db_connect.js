// var mysql = require('mysql2/promise')
const {Sequelize} = require("sequelize")
const initModels = require("./models/init-models")

const sequelize = new Sequelize('geng115_db', 'root', 'g18668168837', {
    host: 'localhost',
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