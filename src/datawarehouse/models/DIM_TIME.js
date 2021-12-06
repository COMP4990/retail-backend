const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DIM_TIME', {
    time_key: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    day: {
      type: DataTypes.DECIMAL(2,0),
      allowNull: false
    },
    month: {
      type: DataTypes.DECIMAL(2,0),
      allowNull: false
    },
    year: {
      type: "YEAR(4)",
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'DIM_TIME',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "time_key" },
        ]
      },
    ]
  });
};
