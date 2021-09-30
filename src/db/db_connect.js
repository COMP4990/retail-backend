var mysql = require('mysql')
var connection = mysql.createConnection({
  host: 'geng115.myweb.cs.uwindsor.ca',
  user: 'geng115_db',
  password: 'password',
  database: 'geng115_db'

})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

connection.end()