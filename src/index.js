const {models, sequelize}= require("./db/db_connect")
const express = require('express');
const bycrypt = require('bcryptjs');
const e = require("express");

const PORT = process.env.PORT || 5000

const app = express();
const router = express.Router();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cors());

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
});



app.post("/login", async(req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const user = await models.Admin.findOne({
            where:{
                email: email
            }})

        // Check if user exists
        if(!user){
            res.status(400).send("User does not exist")
        }

        // password authentication
        if(bycrypt.compareSync(password, user.password)){
        
            res.status(200).json(result)
        }else{
            res.status(400).send("Incorrect Password")
        }
            
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.post("/register", async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        // encrypt password and create a new user in db
        const hash = await bycrypt.hash(password,10)
        const user = await models.Admin.create({email, password:hash})
        
        res.status(201).json(user)
        
    }catch (error) {
        if(error.name == "SequelizeUniqueConstraintError"){
            
            res.status(400).send("Email already registered")
        }else{

            res.status(500).json(error)
        }
    }
})

// app.post('/login', async (req, res) => )

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));



// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.send('OK'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))