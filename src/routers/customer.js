const express = require('express')
const router = express.Router()
const {models, sequelize}= require("../db/db_connect")
const bycrypt = require('bcryptjs') // used for encrypt password
const jwt = require('jsonwebtoken')
const fs = require('fs') // used for store user info in json web token
const path = require('path')
const multer = require('multer')
const { dw_models } = require('../datawarehouse/dw_connect')
const chalk = require('chalk')
const {newCustomerInDB, newOrderInDB, newProductInDB, newTimeInDB} = require('../db/ETL')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, "../../public"))
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '.jpg') //Appending .jpg
    }
})

const upload = multer({storage})


// List products in store
router.get("/products", async (req, res) => {
    try {
        const products = await models.product.findAll()
        
        res.json(products).status(200)
        
    } catch (error) {
        res.send(error).status(500)
    }

})

router.get("/product", async (req, res) => {
    const product_id = req.query.product_id
    try {
        if (product_id !== undefined && product_id !== null) {
            // console.log(product_id)
            const product = await models.product.findByPk(product_id)
            res.json(product).status(200)
        }else{
            res.status(400).send("product_id missing")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})


router.post("/addProduct",upload.single('product_image'), async(req, res) => {
    const product_name = req.body.product_name
    const description = req.body.description
    const price = req.body.price

    var image_path
    if (req.file !== undefined){
        image_path = "/" + req.file.filename
    }else{
        image_path = null
    }
    const sku = req.body.sku
    const item_in_stock = req.body.item_in_stock
    const brand_id = req.body.brand_id
    const category_id = req.body.category_id

    try {
        const product = await models.product.create({
            brand_id, 
            product_name, 
            category_id,
            description, 
            price, 
            image_path, 
            sku, 
            item_in_stock})
        
        res.status(201).json(product)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get("/brands", async (req, res) => {
    try {
        const brands = await models.brand.findAll({})
        res.status(200).json(brands)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get("/categories", async (req, res) => {
    try {
        const categories = await models.category.findAll({})
        res.status(200).json(categories)
    } catch (error) {
        res.status(500).send(error)
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

router.delete("/deleteCartItem", async (req, res) => {
    const user_id = req.query.user_id
    const product_id = req.query.product_id

    try {
        if (user_id !== undefined && product_id !== undefined){
            const result = await models.cart.destroy({
                where: {
                    user_id,
                    product_id
                }
            })
            res.status(200).json(result)
        }else{
            res.status(400).send("User or product id not specified")
        }
    } catch (error) {
        res.status(500).send(error)
    }
})


// list items in user's shopping cart
// takes ?user_id as query parameter
router.get("/cart", async (req, res) =>{
    const user_id=req.query.user_id
    try {
        if (!user_id){
            throw new Error("User ID not included")
        }
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
        
        var new_customer = await newCustomerInDB()
        
        var new_record = await newProductInDB()
        // console.log(new_record)
        var newOrder = await newOrderInDB()
        var newTime = await newTimeInDB()
        

        // get the order entity & order_key in DIM_ORDER
        // const order_key = order_record.order_key
        
        // console.log(order_record)
        
        const current_customer = await models.customer.findByPk(user_id)
        const userInDIM = await dw_models.DIM_CUSTOMER.findOne({
            where: {
                username: current_customer.username,
                fname: current_customer.fname,
                lname: current_customer.lname,
                address: current_customer.address,
                email: current_customer.email
            }
        })
        
        // console.log(userInDIM)
        
        const timeEntity = await dw_models.DIM_TIME.findOne({
            where: sequelize.where(sequelize.fn('date', sequelize.col('created_at')), new Date().toISOString().slice(0, 10))
        })

        // const order_record = await dw_models.DIM_ORDER.findOne({where: order_id })
        new_record.map(async(item, index) => {

            
            // get the item entity in product table
            // const product = await models.product.findByPk(item.product_id)
            // // const product_brand = await models.brand.findByPk(product.brand_id)
            // // const product_category_id = await models.category.findByPk(product.category_id)

            // // find the corresponding product in DIM_PRODUCT and get the product_key
            // const productInDIM = await dw_models.DIM_PRODUCT.findOne({
            //     where: {
            //         product_id: item.product_id,
            //         product_name: product.product_name,
            //         price: product.price
            //     }
            // })
            // console.log(productInDIM)
            
            
            
            // console.log(order_record)

            const order_fact = await dw_models.ORDER_FACT.create({
                customer_key: userInDIM.customer_key,
                time_key: timeEntity.time_key,
                order_key: newOrder[0].order_key,
                product_key: item.product_key,
                quantity: ordered_items[index].quantity,
                subtotal: ordered_items[index].subtotal,
                price_each: item.price
            })

            return order_fact

        })
        


        // console.log(order_key)
        // Promise.all( async () => {
            
        // })
        res.status(201).send(result)

    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = router