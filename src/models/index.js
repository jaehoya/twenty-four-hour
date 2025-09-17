const sequelize = require("../config/database");
const User = require("./user");
const File = require("./file");
const UserProfile = require("./userProfile");

// Associations
User.hasOne(UserProfile, { foreignKey: 'userId' });
UserProfile.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  File,
  UserProfile,
};
