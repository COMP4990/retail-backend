var DataTypes = require("sequelize").DataTypes;
var _DIM_CUSTOMER = require("./DIM_CUSTOMER");
var _DIM_ORDER = require("./DIM_ORDER");
var _DIM_PRODUCT = require("./DIM_PRODUCT");
var _DIM_TIME = require("./DIM_TIME");
var _ORDER_FACT = require("./ORDER_FACT");

function initModels(sequelize) {
  var DIM_CUSTOMER = _DIM_CUSTOMER(sequelize, DataTypes);
  var DIM_ORDER = _DIM_ORDER(sequelize, DataTypes);
  var DIM_PRODUCT = _DIM_PRODUCT(sequelize, DataTypes);
  var DIM_TIME = _DIM_TIME(sequelize, DataTypes);
  var ORDER_FACT = _ORDER_FACT(sequelize, DataTypes);

  ORDER_FACT.belongsTo(DIM_CUSTOMER, { as: "customer_key_DIM_CUSTOMER", foreignKey: "customer_key"});
  DIM_CUSTOMER.hasMany(ORDER_FACT, { as: "ORDER_FACTs", foreignKey: "customer_key"});
  ORDER_FACT.belongsTo(DIM_ORDER, { as: "order_key_DIM_ORDER", foreignKey: "order_key"});
  DIM_ORDER.hasMany(ORDER_FACT, { as: "ORDER_FACTs", foreignKey: "order_key"});
  ORDER_FACT.belongsTo(DIM_PRODUCT, { as: "product_key_DIM_PRODUCT", foreignKey: "product_key"});
  DIM_PRODUCT.hasMany(ORDER_FACT, { as: "ORDER_FACTs", foreignKey: "product_key"});
  ORDER_FACT.belongsTo(DIM_TIME, { as: "time_key_DIM_TIME", foreignKey: "time_key"});
  DIM_TIME.hasMany(ORDER_FACT, { as: "ORDER_FACTs", foreignKey: "time_key"});

  return {
    DIM_CUSTOMER,
    DIM_ORDER,
    DIM_PRODUCT,
    DIM_TIME,
    ORDER_FACT,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
