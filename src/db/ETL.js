const { models, sequelize } = require("../db/db_connect")
const { dw_models, dw_sequelize, QueryTypes } = require("../datawarehouse/dw_connect")

//SELECT C.customer_id, C.username, C.fname, C.lname, C.address, C.email FROM `retail_store`.`customer` as C WHERE C.customer_ID NOT IN (SELECT D.customer_id FROM `retail_dw`.`DIM_CUSTOMER` as D)


// select customer_id, username, fname, lname, address, email from retail_store.customer WHERE (customer_id, username, fname, lname, address, email ) NOT IN (select customer_id, username, fname, lname, address,email from retail_dw.DIM_CUSTOMER)
async function newCustomerInDB () {
    const newCustomerHistory = await sequelize.query("\
    select customer_id, username, fname, lname, address, email from retail_store.customer \
    WHERE (customer_id, username, fname, lname, address, email ) \
    NOT IN (\
        select customer_id, username, fname, lname, address,email \
        from retail_dw.DIM_CUSTOMER)\
    ",
        {
            type: QueryTypes.SELECT
        }
    )

    const result = await dw_models.DIM_CUSTOMER.bulkCreate(newCustomerHistory)

    // console.log(result)
    // console.log()
    return result
}


//select order_id, created_at, payment_status from retail_store.order WHERE (order_id, created_at, payment_status ) NOT IN (select order_id, created_at, payment_status from retail_dw.DIM_ORDER)

async function newOrderInDB() {
    const newOrder = await sequelize.query("select order_id, created_at, payment_status \
    from retail_store.order \
    WHERE order_id NOT IN (select order_id from retail_dw.DIM_ORDER)",
    {
        type: QueryTypes.SELECT
    }
    )
    
    newOrder.forEach((order) => {
        if(order.payment_status === "complete"){
            order.payment_status = 1
        }else{
            order.payment_status = 0
        }
        
        // console.log(order)
    })
    
    const result = await dw_models.DIM_ORDER.bulkCreate(newOrder)
    
    // console.log(result)
    return result
}

async function newProductInDB() {
    const newProducts = await sequelize.query("\
    select product_id, product_name, P.brand_id, \
    brand_name, P.category_id, category_name, \
    price, sku, item_in_stock \
    from retail_store.product as P \
    left join retail_store.brand as B on P.brand_id = B.brand_id \
    left join retail_store.category as C on P.category_id = C.category_id \
    WHERE (\
        product_id, product_name, P.brand_id,\
        brand_name, P.category_id, category_name,\
        price, sku, item_in_stock) NOT IN ( \
            SELECT product_id, product_name, \
            brand_id, brand_name, category_id, category_name, \
            price, sku, item_in_stock \
            FROM retail_dw.DIM_PRODUCT\)",
        {
            type: QueryTypes.SELECT
        }
    )

    const result = await dw_models.DIM_PRODUCT.bulkCreate(newProducts)

    // console.log(result)
    return result
}

//select DISTINCT DAY(created_at),MONTH(created_at),YEAR(created_at),DATE(created_at) from retail_store.order WHERE DATE(created_at) NOT IN ( select created_at from retail_dw.DIM_TIME )
async function newTimeInDB(){
    const newTime = await sequelize.query("\
    select DISTINCT DAY(created_at) as day,\
    MONTH(created_at) as month,\
    YEAR(created_at) as year,\
    DATE(created_at) as created_at \
    from retail_store.order \
    WHERE DATE(created_at) NOT IN ( \
        select created_at from retail_dw.DIM_TIME\
    )",
        {
            type: QueryTypes.SELECT
        }
    )

    // console.log(newTime)

    const result = await dw_models.DIM_TIME.bulkCreate(newTime)

    // console.log(result)
    return result
}



// newCustomerInDB()
// newOrderInDB()
// newProductInDB()
// newTimeInDB()
module.exports = {newCustomerInDB, newOrderInDB, newProductInDB, newTimeInDB}