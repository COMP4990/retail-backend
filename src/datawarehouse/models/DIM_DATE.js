const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DIM_DATE', {
    time_key: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      unique: "date"
    }
  }, {
    sequelize,
    tableName: 'DIM_DATE',
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
      {
        name: "date",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "date" },
        ]
      },
    ]
  });
};
