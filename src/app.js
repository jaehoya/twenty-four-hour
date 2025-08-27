const express = require("express");
const app = express();
require("dotenv").config(); // .env 환경변수 로드
const sequelize = require("./config/database"); // DB 연결 객체

app.use(express.json()); // JSON 요청 파싱

// DB 연결 확인
sequelize.authenticate()
  .then(() => console.log("DB 연결 성공"))
  .catch((e) => console.error("DB 연결 실패:", e.message));

// 라우터 등록 (회원가입 라우터 포함)
app.use("/api/users", require("./routes/user.routes"));
app.use("api/files", require("./routes/file.routes"));

// 공통 에러 핸들러 (마지막에 두기)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "서버 오류가 발생했습니다.";

  res.status(status).json({ 
    state: status,
    code,
    message });
});

module.exports = app;
