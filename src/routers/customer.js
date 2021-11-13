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



module.exports = router