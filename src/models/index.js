const sequelize = require("../config/database");
const User = require("./user");
// 앞으로 다른 모델도 여기에 import
// const File = require("./File");
// const RefreshToken = require("./RefreshToken");

module.exports = {
  sequelize,
  User,
  // File,
  // RefreshToken,
};
