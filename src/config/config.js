// Sequelize CLI와 애플리케이션 공통으로 사용하는 DB 설정 파일

const path = require("path");
const fs = require("fs");

// 프로젝트 루트의 .env 파일을 명시적으로 로드
const dotenvPath = path.resolve(process.cwd(), ".env");
if(fs.existsSync(dotenvPath)) {
    require("dotenv").config({ path: dotenvPath });
} else {
    console.warn(".env 파일을 찾지 못했습니다:", dotenvPath);
}

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,   // tfh_db
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mysql"
  }
};