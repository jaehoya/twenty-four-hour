require("dotenv").config(); // 환경 변수 불러오기
const app = require("./app");
const sequelize = require("./config/database");
const db = require("./models");

const PORT = process.env.PORT || 4000;

// Start AI Worker
require("./worker/tag.worker");

(async () => {
  try {
    // 개발 단계에서는 DB 스키마 자동 동기화
    // alter: true -> 모델과 DB 테이블 간의 차이(새 컬럼 등)를 자동으로 반영
    //await db.sequelize.sync({ alter: true });

    // 서버 실행
    app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );
  } catch (e) {
    console.error("Server boot failed:", e);
    process.exit(1); // 치명적 오류 시 종료
  }
})();
