const dotenv = require('dotenv').config()
// setup db connection string
const {models, sequelize}= require("./db/db_connect")
const express = require('express');
const admin = require('./routers/admin')
const customer = require('./routers/customer')
// used for Cross-Origin-Resource-Sharing
const cors = require('cors')
// used for encrypt password
const bycrypt = require('bcryptjs')
// used for store user info in json web token
const jwt = require('jsonwebtoken')


const PORT = process.env.PORT || 8000

const app = express();

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/',admin)
app.use('/',customer)


/**
 * GET v1/status
 */
app.get('/', async (req, res) => {
    try {
        //DB connection testing
        // const [row, fields] = await db.query("SELECT 1 + 1 AS solution")
        const schemas = await sequelize.showAllSchemas()
        res.status(200).json(schemas)
        
    } catch (error) {
        res.status(502).send(error)
    }

    // res.send('Welcome to our retail store backend')
})

app.listen(PORT, () => console.log(`Listening on ${ PORT }\nhttp://localhost:5000`));

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.send('OK'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))