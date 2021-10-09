var mysql = require('mysql2/promise')
var connection = mysql.createPool({
  host: 'geng115.myweb.cs.uwindsor.ca',
  user: 'geng115_db',
  password: 'password',
  database: 'geng115_db',
  waitForConnections: true
})

// connection.connect()

// connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
//   if (err) throw err

//   console.log('The solution is: ', rows[0].solution)
// })

// connection.end()
module.exports = connection