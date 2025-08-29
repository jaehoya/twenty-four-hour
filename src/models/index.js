const sequelize = require("../config/database");
const User = require("./user");
const File = require("./file");
// 앞으로 다른 모델도 여기에 import
// const RefreshToken = require("./RefreshToken");

module.exports = {
  sequelize,
  User,
  File,
  // RefreshToken,
};
