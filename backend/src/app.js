const express = require("express");
const app = express();
require("dotenv").config(); // .env 환경변수 로드
const sequelize = require("./config/database"); // DB 연결 객체
const path = require("path");

const cors = require("cors");  // CORS 미들웨어 추가
app.use(cors());  // 모든 도메인 허용

const morgan = require("morgan"); // 요청 로깅 미들웨어 추가
app.use(morgan("combined")); // 요청 로깅

app.use(express.json()); // JSON 요청 파싱

app.use("/uploads", express.static(process.env.UPLOADS_ROOT));

const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// DB 연결 확인
sequelize.authenticate()
  .then(() => console.log("DB 연결 성공"))
  .catch((e) => console.error("DB 연결 실패:", e.message));

// 라우터 등록 
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/files", require("./routes/file.routes"));
app.use("/api/profile", require("./routes/userProfile.routes"));
app.use("/api/folders", require("./routes/folder.routes"));
app.use("/api/disk", require("./routes/disk.routes"));
app.use("/api/favorites", require("./routes/favorite.routes"));
app.use("/api/shares", require("./routes/share.routes"));
app.use("/api/trash", require("./routes/trash.routes")); // 휴지통 라우트 등록
app.use("/api/tags", require("./routes/tag.routes"));

// 공통 에러 핸들러 (마지막에 두기)
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "서버 오류가 발생했습니다.";

  res.status(status).json({
    state: status,
    code,
    message
  });
});

module.exports = app;

