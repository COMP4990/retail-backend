var DataTypes = require("sequelize").DataTypes;
var _Admin = require("./Admin");
var _brand = require("./brand");
var _brand_products = require("./brand_products");
var _cart = require("./cart");
var _category = require("./category");
var _customer = require("./customer");
var _customer_orders = require("./customer_orders");
var _order = require("./order");
var _order_history = require("./order_history");
var _product = require("./product");

function initModels(sequelize) {
  var Admin = _Admin(sequelize, DataTypes);
  var brand = _brand(sequelize, DataTypes);
  var brand_products = _brand_products(sequelize, DataTypes);
  var cart = _cart(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var customer = _customer(sequelize, DataTypes);
  var customer_orders = _customer_orders(sequelize, DataTypes);
  var order = _order(sequelize, DataTypes);
  var order_history = _order_history(sequelize, DataTypes);
  var product = _product(sequelize, DataTypes);

  brand.belongsToMany(product, { as: 'product_id_products', through: brand_products, foreignKey: "brand_id", otherKey: "product_id" });
  customer.belongsToMany(order, { as: 'order_id_orders', through: customer_orders, foreignKey: "customer_id", otherKey: "order_id" });
  customer.belongsToMany(product, { as: 'product_id_product_carts', through: cart, foreignKey: "user_id", otherKey: "product_id" });
  order.belongsToMany(customer, { as: 'customer_id_customers', through: customer_orders, foreignKey: "order_id", otherKey: "customer_id" });
  order.belongsToMany(product, { as: 'product_id_product_order_histories', through: order_history, foreignKey: "order_id", otherKey: "product_id" });
  product.belongsToMany(brand, { as: 'brand_id_brands', through: brand_products, foreignKey: "product_id", otherKey: "brand_id" });
  product.belongsToMany(customer, { as: 'user_id_customers', through: cart, foreignKey: "product_id", otherKey: "user_id" });
  product.belongsToMany(order, { as: 'order_id_order_order_histories', through: order_history, foreignKey: "product_id", otherKey: "order_id" });
  brand_products.belongsTo(brand, { as: "brand", foreignKey: "brand_id"});
  brand.hasMany(brand_products, { as: "brand_products", foreignKey: "brand_id"});
  product.belongsTo(brand, { as: "brand", foreignKey: "brand_id"});
  brand.hasMany(product, { as: "products", foreignKey: "brand_id"});
  product.belongsTo(category, { as: "category", foreignKey: "category_id"});
  category.hasMany(product, { as: "products", foreignKey: "category_id"});
  cart.belongsTo(customer, { as: "user", foreignKey: "user_id"});
  customer.hasMany(cart, { as: "carts", foreignKey: "user_id"});
  customer_orders.belongsTo(customer, { as: "customer", foreignKey: "customer_id"});
  customer.hasMany(customer_orders, { as: "customer_orders", foreignKey: "customer_id"});
  customer_orders.belongsTo(order, { as: "order", foreignKey: "order_id"});
  order.hasMany(customer_orders, { as: "customer_orders", foreignKey: "order_id"});
  order_history.belongsTo(order, { as: "order", foreignKey: "order_id"});
  order.hasMany(order_history, { as: "order_histories", foreignKey: "order_id"});
  brand_products.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(brand_products, { as: "brand_products", foreignKey: "product_id"});
  cart.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(cart, { as: "carts", foreignKey: "product_id"});
  order_history.belongsTo(product, { as: "product", foreignKey: "product_id"});
  product.hasMany(order_history, { as: "order_histories", foreignKey: "product_id"});

  return {
    Admin,
    brand,
    brand_products,
    cart,
    category,
    customer,
    customer_orders,
    order,
    order_history,
    product,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
