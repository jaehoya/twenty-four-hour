const sequelize = require("../config/database");
const User = require("./user");
const File = require("./file");
const UserProfile = require("./userProfile");
const Folder = require("./folder");
const Favorite = require("./favorite");

// Associations
User.hasOne(UserProfile, { foreignKey: 'userId' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

UserProfile.belongsTo(File, { as: 'ProfileImage', foreignKey: 'profileImageId' });

User.hasMany(Folder, { foreignKey: 'userId' });
Folder.belongsTo(User, { foreignKey: 'userId' });

Folder.hasMany(Folder, { as: 'children', foreignKey: 'parentId' });
Folder.belongsTo(Folder, { as: 'parent', foreignKey: 'parentId' });

Folder.hasMany(File, { foreignKey: 'folderId' });
File.belongsTo(Folder, { foreignKey: 'folderId' });

User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

File.hasMany(Favorite, {
  foreignKey: "targetId",
  constraints: false,
  scope: { targetType: "file" },
});
Favorite.belongsTo(File, { foreignKey: "targetId", constraints: false });

Folder.hasMany(Favorite, {
  foreignKey: "targetId",
  constraints: false,
  scope: { targetType: "folder" },
});
Favorite.belongsTo(Folder, { foreignKey: "targetId", constraints: false });


module.exports = {
  sequelize,
  User,
  File,
  UserProfile,
  Folder,
  Favorite,
};
