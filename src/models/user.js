const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("User", {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  email: {
    type: DataTypes.STRING(120),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  username: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING(64),
    allowNull: false
  }
}, {
  tableName: "users",
  timestamps: true,
  indexes: [
    { unique: true, fields: ["email"] },
    { unique: true, fields: ["username"] }
  ]
});

module.exports = User;
