const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Favorite = sequelize.define("Favorite", {
    id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    userId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    targetId: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    targetType: {
      type: DataTypes.ENUM("file", "folder"),
      allowNull: false,
    },
},
{
    tableName: "favorites",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "targetId", "targetType"],
      },
    ],
}
);

module.exports = Favorite;