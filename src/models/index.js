const sequelize = require("../config/database");
const User = require("./user");
const File = require("./file");
const UserProfile = require("./userProfile");
const Folder = require("./folder");
const Favorite = require("./favorite");
const Share = require("./share")(sequelize, require("sequelize").DataTypes);
const FileTag = require("./fileTag");

// Associations
User.hasOne(UserProfile, { foreignKey: 'userId' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

UserProfile.belongsTo(File, { as: 'ProfileImage', foreignKey: 'profileImageId' });

User.hasMany(Folder, { foreignKey: 'userId' });
Folder.belongsTo(User, { foreignKey: 'userId' });

// User와 File 모델 간의 1:N 관계 설정
User.hasMany(File, { foreignKey: 'user_id' });
File.belongsTo(User, { foreignKey: 'user_id' });

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

File.hasMany(Share, { foreignKey: 'fileId' });
Share.belongsTo(File, { foreignKey: 'fileId' });

File.hasMany(FileTag, { foreignKey: "file_id", as: "tags" });
FileTag.belongsTo(File, { foreignKey: 'file_id' });

module.exports = {
  sequelize,
  User,
  File,
  UserProfile,
  Folder,
  Favorite,
  Share, 
  FileTag,
};
