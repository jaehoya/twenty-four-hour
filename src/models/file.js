const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const File = sequelize.define("File", {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: { type: DataTypes.BIGINT.UNSIGNED },
  folderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true },
  original_name: { type: DataTypes.STRING },
  stored_name: { type: DataTypes.STRING },
  mime_type: { type: DataTypes.STRING },
  size: { type: DataTypes.BIGINT },
  path: { type: DataTypes.STRING },
  suggestedFolderId: { type: DataTypes.BIGINT.UNSIGNED, allowNull: true }
}, {
  tableName: "files",
  timestamps: true,
  paranoid: true,
});

module.exports = File;