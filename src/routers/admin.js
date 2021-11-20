const express = require('express')
const router = express.Router()
const {models, sequelize}= require("../db/db_connect")
const {dw_models, dw_sequelize, QueryTypes} = require("../datawarehouse/dw_connect")

// used for encrypt password
const bycrypt = require('bcryptjs')
// used for store user info in json web token
const jwt = require('jsonwebtoken')

// admin login
router.post("/login", async (req, res) => {
    try {
        // get email & password from request body
        const email = req.body.email
        const password = req.body.password

        // check if user exists in db
        const user = await models.Admin.findOne({
            where:{
                email: email
            }})

        // Check if user exists
        if(user === null){
            return res.status(400).send("User does not exist")
        }

        // password authentication
        if(bycrypt.compareSync(password, user.password)){
            console.log(user)
            const access_token = jwt.sign({email:user.email, password: user.password}, process.env.ACCESS_TOKEN_SECRET)
            const result = {
                accessToken:access_token,
                user: {
                    email: user.email,
                    id: user.id
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


// admin registration
router.post("/register", async (req, res) => {
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

            res.status(500).send(error)
        }
    }
})

// List number of all orders made in the past 
router.get("/numOfAllOrders", async (req, res) => {
    try {
        const result = await dw_models.DIM_ORDER.findAndCountAll()
        
        res.status(200).json(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

/**
 * 
 * SELECT O.created_at as DATE, SUM(subtotal) 
 * FROM ORDER_FACT as H, DIM_ORDER as O 
 * WHERE H.order_key = O.order_key AND O.payment_status = 1 
 * GROUP BY O.created_at
 */

router.get("/salesPrice/:Days", async (req, res) =>{
    const Days = req.params.Days
    try {
        var daySpan;
        if (Days == "day") {
            daySpan = 1
        }
        if (Days == "week") {
            daySpan = 7
        }
        if (Days == "month") {
            daySpan = 31
        }

        if (daySpan) {
            var result = await dw_sequelize.query(
                'SELECT DATE(O.created_at) as `Date`, SUM(subtotal) as `Sales` ' +
                'FROM ORDER_FACT as H, DIM_ORDER as O ' +
                'WHERE H.order_key = O.order_key AND O.payment_status = 1 ' +
                'GROUP BY DATE(O.created_at);',
                {
                    type: QueryTypes.SELECT
                })

            result.forEach( (item) => {
                // console.log(item.scales)
                item.Sales = parseFloat(item.Sales)
            })

            res.status(200).json(result)
        }

        
    } catch (error) {
        
    }
    
})

module.exports = router