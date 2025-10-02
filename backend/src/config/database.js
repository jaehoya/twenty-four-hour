const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,      // DB 이름
  process.env.DB_USER,      // 사용자
  process.env.DB_PASSWORD,  // 비밀번호
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    port: process.env.DB_PORT || 3306,
    logging: false, // SQL 로그 숨기기 (원하면 true로)
  }
);

module.exports = sequelize;
