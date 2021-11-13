const express = require('express')
const router = express.Router()
const {models, sequelize}= require("../db/db_connect")
const bycrypt = require('bcryptjs') // used for encrypt password
const jwt = require('jsonwebtoken')
const fs = require('fs') // used for store user info in json web token
const path = require('path')
const { nextTick } = require('process')

// List products in store
router.get("/products", async (req, res) => {
    try {
        const products = await models.product.findAll();
        
        res.json(products).status(200)
    } catch (error) {
        res.send(error).status(500)
    }

})

// user login
router.post("/login", async (req, res) => {
    try {
        // get email & password from request body
        const username = req.body.username
        const password = req.body.password

        // check if user exists in db
        const user = await models.customer.findOne({
            where:{
                username: username
            }})

        // Check if user exists
        if(user === null){
            return res.status(400).send("User does not exist")
        }

        // password authentication
        if(bycrypt.compareSync(password, user.password)){
            console.log(user)
            const access_token = jwt.sign({username:user.username, password: user.password}, process.env.ACCESS_TOKEN_SECRET)
            const result = {
                accessToken:access_token,
                user: {
                    username: user.username,
                    email:user.email,
                    id: user.customer_id
                }
                
            }
            res.status(200).json(result)
        }else{
            res.status(400).send("Incorrect Password")
        }
            
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})


// user registration
router.post("/register", async (req, res) => {
    try {
        const username = req.body.username
        
        // check if user already exists
        // const existingUser = await models.customer.findOne({ where: { username: username } })
        // console.log(existingUser)
        // if(existingUser !== null){
        //     // throw new SequelizeUniqueConstraintError()
        //     res.status(400).send("Username Already Registered")
        // }

        const fname = req.body.fname
        const lname = req.body.lname
        const password = req.body.password
        const address = req.body.address
        const email = req.body.email
        
        // encrypt password and create a new user in db
        const hashed_password = await bycrypt.hash(password,10)
        
        // await sequelize.sync({alter: true}) //sync defined models to database

        // create a new user into customer table
        const user = await models.customer.create({username,fname,lname,password:hashed_password, address, email})
        
        res.status(201).json(user)
        
    }catch (error) {
        if(error.name == "SequelizeUniqueConstraintError"){
            
            res.status(400).send("Username Already registered")
        }else{

            res.status(500).json(error)
        }
    }
})

module.exports = router