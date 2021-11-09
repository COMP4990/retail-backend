const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('product', {
    product_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    brand_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'brand',
        key: 'brand_id'
      }
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    price: {
      type: DataTypes.DOUBLE(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    image: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    sku: {
      type: DataTypes.STRING(32),
      allowNull: false
    },
    item_in_stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'product',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "product_id" },
        ]
      },
      {
        name: "brand_id",
        using: "BTREE",
        fields: [
          { name: "brand_id" },
        ]
      },
    ]
  });
};
