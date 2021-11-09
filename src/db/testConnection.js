require('dotenv').config()
const chalk = require('chalk')
const initModels = require("./models/init-models")
const {Sequelize} = require("sequelize")
// var sequelize = new Sequelize('geng115_db', 'root', 'g18668168837', {
//     host: 'localhost',
//     dialect: 'mysql',
//     pool: {
//       max: 5,
//       min: 0,
//       idle: 10000
//     }
//   });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
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
  console.log("Show all admin records")
  const admin= await models.Admin.findAll({raw:true})
  console.log(typeof(admin))
  process.exit()
}

// connectionTesting()
// createAdmin("auth@example.com","password")
console.log(chalk.cyan("Checking Database Connection: "))
showAdmin()