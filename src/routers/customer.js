const express = require('express')
const router = express.Router()
const {models, sequelize}= require("../db/db_connect")
const bycrypt = require('bcryptjs') // used for encrypt password
const jwt = require('jsonwebtoken')
const fs = require('fs') // used for store user info in json web token
const path = require('path')

// List products in store
router.get("/products", async (req, res) => {
    try {
        const products = await models.product.findAll();
        
        res.json(products).status(200)
    } catch (error) {
        res.send(error).status(500)
    }

})

// update item quantity & subtotal in shopping cart
router.post("/addToCart", async (req, res) =>{
    const user_id=req.body.user_id
    const product_id = req.body.product_id
    console.log(user_id, product_id)
    try {
        // get product price and current stock
        const product = await models.product.findByPk(product_id)
        const price = product.price
        const item_in_stock = product.item_in_stock
        // console.log("product")
        // console.log(product)
        var productInCart = await models.cart.findOne({
            where: {
                user_id, 
                product_id
            }
        })
        // console.log(productInCart)

        // if there this product already in cart, just change quantity and update subtotal
        if (productInCart !== null){
            productInCart.quantity = productInCart.quantity >= item_in_stock ? item_in_stock : productInCart.quantity + 1
            productInCart.subtotal = productInCart.quantity * price
            const affectedRows = await models.cart.update(
                {
                    quantity: productInCart.quantity,
                    subtotal: productInCart.subtotal
                }, 
                {
                    where:{
                        user_id,
                        product_id
                    }
                }
            )
            
            return res.status(201).send("Affected Row(s): "+affectedRows)
            
        }else{ // if this product not in cart, add a new item into cart
            var productInCart = await models.cart.create(
                {
                    user_id,
                    product_id,
                    quantity: 1,
                    subtotal:price        
                }
            )
            return res.status(201).send(productInCart)
        }
    } catch (error) {
        res.status(500).send(error)
    }

})

// list items in user's shopping cart
router.get("/cart", async (req, res) =>{
    const user_id=req.body.user_id
    try {
        // get items by user id
        const items = await models.cart.findAll(
            {
                where:
                    {
                        user_id:user_id
                    }
            }
        )
        res.status(200).send(items)

    } catch (error) {
        res.status(500).send(error)
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

            // sign jwt with username & password
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

router.post("/checkout", async (req, res) => {
    const user_id = req.body.user_id
    try {
        const items = await models.cart.findAll(
            {
                where:
                {
                    user_id: user_id
                }
            }
        )
        /** Item structure
         * [
         *  {
         *      "user_id": 7,
         *      "product_id": 3,
         *      "quantity": 7,
         *      "subtotal": "419.93"
         *   },
         *   {...}
         * ]
         */
        // check if cart is empty
        if( items.length < 1){
            return res.status(400).send("Cart is empty")
        }
        

        // create a new order in db
        const order = await models.order.create({
            customer_id: user_id
        })

        // get order_id & time
        const order_id = order.order_id
        
        // push each ordered item into array and add into order history
        var ordered_items = []
        items.forEach(item => {
            ordered_items.push({
                order_id: order_id,
                product_id: item.product_id,
                quantity: item.quantity,
                subtotal: item.subtotal,
                price_each: item.subtotal / item.quantity
            })
        })

        const result = await sequelize.transaction(async (t) =>{
            const checkout_items = await models.order_history.bulkCreate(ordered_items, {transaction: t})
            
            // clear user shopping cart
            await models.cart.destroy({where: { user_id } })

            Promise.all(
                ordered_items.map( async(item) => {
                    // console.log(item)
                    await models.product.decrement({
                        item_in_stock: item.quantity },
                        { 
                            where: 
                            { 
                                product_id: item.product_id 
                            } 
                        })
                })
            )

            return checkout_items
        })

        // ordered_items.forEach(async (item) => {
        //     console.log(item)
        //     const await models.product.update({ quantity: item.quantity - 1 }, { where: { product_id: item.product_id } })
        // })

        // console.log(ordered_items)
        // const created_at = order.created_at

        res.status(201).send(result)


    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router