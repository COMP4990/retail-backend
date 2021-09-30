const express = require('express')
const PORT = process.env.PORT || 5000

const app = express();
const router = express.Router();


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());



/**
 * GET v1/status
 */
app.get('/', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Listening on ${ PORT }`));



// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.send('OK'))
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))