const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ORDER_FACT', {
    customer_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'DIM_CUSTOMER',
        key: 'customer_key'
      }
    },
    time_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'DIM_TIME',
        key: 'time_key'
      }
    },
    order_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'DIM_ORDER',
        key: 'order_key'
      }
    },
    product_key: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'DIM_PRODUCT',
        key: 'product_key'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price_each: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    subtotal: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'ORDER_FACT',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "customer_key" },
          { name: "time_key" },
          { name: "order_key" },
          { name: "product_key" },
        ]
      },
      {
        name: "order_key",
        using: "BTREE",
        fields: [
          { name: "order_key" },
        ]
      },
      {
        name: "product_key",
        using: "BTREE",
        fields: [
          { name: "product_key" },
        ]
      },
      {
        name: "time_key",
        using: "BTREE",
        fields: [
          { name: "time_key" },
        ]
      },
    ]
  });
};
