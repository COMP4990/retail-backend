const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DIM_PRODUCT', {
    product_key: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    brand_name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category_name: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(15,2),
      allowNull: false
    },
    sku: {
      type: DataTypes.STRING(64),
      allowNull: true
    },
    item_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'DIM_PRODUCT',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_key" },
        ]
      },
    ]
  });
};
