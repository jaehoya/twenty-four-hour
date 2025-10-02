const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Folder = sequelize.define(
  "Folder",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    parentId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "folders",
    timestamps: true,
  }
);

module.exports = Folder;
