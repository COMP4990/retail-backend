const initModels = require("./models/init-models")
const {Sequelize} = require("sequelize")
var sequelize = new Sequelize('geng115_db', 'root', 'g18668168837', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  });

const models = initModels(sequelize)


async function connectionTesting(){
    console.log("Checking Database Connection: ")
    try {
      // await sequelize.sync()
      const result = await sequelize.authenticate()
      await sequelize.showAllSchemas()
      console.log(result)
    } catch (error) {
        console.log(error)
    }
    process.exit()
}

async function createAdmin(email, password) {
  const result = await models.Admin.create({email, password})
  console.log(result)
}

async function showAdmin(){
  const admin= await models.Admin.findAll({raw:true})
  console.log(admin)
}

// connectionTesting()
// createAdmin("auth@example.com","password")
showAdmin()