const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserProfile = sequelize.define(
  "UserProfile",
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
    profileImageId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: true,
    },
  },
  {
    tableName: "user_profiles",
    timestamps: true,
  }
);

module.exports = UserProfile;
