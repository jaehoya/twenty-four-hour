const sequelize = require("../config/database");
const User = require("./user");
const File = require("./file");
const UserProfile = require("./userProfile");
const Folder = require("./folder");

// Associations
User.hasOne(UserProfile, { foreignKey: 'userId' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Folder, { foreignKey: 'userId' });
Folder.belongsTo(User, { foreignKey: 'userId' });

Folder.hasMany(Folder, { as: 'children', foreignKey: 'parentId' });
Folder.belongsTo(Folder, { as: 'parent', foreignKey: 'parentId' });

Folder.hasMany(File, { foreignKey: 'folderId' });
File.belongsTo(Folder, { foreignKey: 'folderId' });

module.exports = {
  sequelize,
  User,
  File,
  UserProfile,
  Folder,
};
