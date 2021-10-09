const db = require("./db/db_connect")

const express = require('express')
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
        const [row, fields] = await db.query("SELECT 1 + 1 AS solution")
        res.status(200).json({row, fields})
        
    } catch (error) {
        res.status(502).send(error)
    }

    // res.send('Welcome to our retail store backend')
});

// app.post('/login', async (req, res) => )

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));



// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.send('OK'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))