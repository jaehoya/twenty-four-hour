const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const File = sequelize.define("File", {
  user_id: { type: DataTypes.BIGINT },
  original_name: { type: DataTypes.STRING },
  stored_name: { type: DataTypes.STRING },
  mime_type: { type: DataTypes.STRING },
  size: { type: DataTypes.BIGINT },
  path: { type: DataTypes.STRING }
}, {
  tableName: "files",
  timestamps: true
});

module.exports = File;