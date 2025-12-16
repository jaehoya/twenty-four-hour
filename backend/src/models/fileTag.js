const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FileTag = sequelize.define(
  "FileTag",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    file_id: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "file_tags",
    timestamps: true,
  }
);

module.exports = FileTag;
