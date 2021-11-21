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


router.get("/salesPrice/:mode", async (req, res) =>{
    const mode = req.params.mode
    try {
        var daySpan;
        if (mode == "day") {
            daySpan = 1
        }
        if (mode == "week") {
            daySpan = 7
        }
        if (mode == "month") {
            daySpan = 30
        }

        if (mode == "year") {
            daySpan = 365
        }

        if (daySpan) {
            var result = await dw_sequelize.query(
                'SELECT DISTINCT DIM_DATE.date as Date, IFNULL(SUM(subtotal),0) as Sales FROM DIM_DATE ' +
                'LEFT JOIN DIM_TIME ON DIM_DATE.date = DIM_TIME.created_at ' +
                'LEFT JOIN ORDER_FACT ON ORDER_FACT.time_key = DIM_TIME.time_key ' +
                'LEFT JOIN DIM_ORDER ON ORDER_FACT.order_key = DIM_ORDER.order_key ' +
                'WHERE DIM_DATE.date BETWEEN DATE_SUB(curdate(), INTERVAL :daySpan DAY) AND curdate() ' +
                'GROUP BY DIM_DATE.date ' +
                'ORDER by DIM_DATE.date ASC',
                {
                    type: QueryTypes.SELECT,
                    replacements: {daySpan: daySpan}
                }
            )

            // parse decimal to float to remove the double quotation mark
            result.forEach( (item) => {
                // console.log(item.scales)
                item.Sales = parseFloat(item.Sales)
            })

            res.status(200).json(result)
        }

        
    } catch (error) {
        
    }
    
})

router.get("/topSellingBrand", async (req, res) => {
    try {
        var result = await dw_sequelize.query(
            'SELECT brand_name as `brand`, SUM(quantity) as `quantity` FROM DIM_PRODUCT ' +
            'INNER JOIN ORDER_FACT ON ORDER_FACT.product_key = DIM_PRODUCT.product_key ' +
            'INNER JOIN DIM_ORDER ON ORDER_FACT.order_key = DIM_ORDER.order_key ' +
            'GROUP BY brand_name LIMIT 5;', {
            type: QueryTypes.SELECT
        })
        
        // remove double quotation mark for value data
        result.forEach((item) => {
            item.quantity = parseInt(item.quantity)
        })

        res.status(200).json(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/topSellingProduct", async (req, res) => {
    try {
        var result = await dw_sequelize.query(
            'SELECT product_name as `product`, SUM(quantity) as `quantity` FROM DIM_PRODUCT ' +
            'INNER JOIN ORDER_FACT ON ORDER_FACT.product_key = DIM_PRODUCT.product_key ' +
            'INNER JOIN DIM_ORDER ON ORDER_FACT.order_key = DIM_ORDER.order_key ' +
            'GROUP BY product_name ' +
            'ORDER BY quantity DESC '+ 
            'LIMIT 5; ', {
            type: QueryTypes.SELECT
        })

        // remove double quotation mark for value data
        result.forEach((item) => {
            item.quantity = parseInt(item.quantity)
        })

        res.status(200).json(result)
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router