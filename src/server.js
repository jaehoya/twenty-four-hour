require("dotenv").config(); // 환경 변수 불러오기
const app = require("./app");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    // 개발 단계에서는 DB 스키마 자동 동기화
    await sequelize.sync({ alter: true }); // { alter: true } 옵션을 주면 컬럼 자동 업데이트

    // 서버 실행
    app.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error("Server boot failed:", e);
    process.exit(1); // 치명적 오류 시 종료
  }
})();
