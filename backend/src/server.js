require("dotenv").config(); // 환경 변수 불러오기
const app = require("./app");
const sequelize = require("./config/database");
const db = require("./models");

const PORT = process.env.PORT || 4000;



(async () => {
  try {
    // 개발 단계에서는 DB 스키마 자동 동기화
    // alter: true -> 모델과 DB 테이블 간의 차이(새 컬럼 등)를 자동으로 반영
    //await db.sequelize.sync({ alter: true });

    // 서버 실행
    const server = app.listen(PORT, "0.0.0.0", () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );

    // Socket.IO 초기화
    const { init } = require("./socket");
    init(server);

    // Start AI Worker (Socket 초기화 후 실행 권장)
    require("./worker/tag.worker");

  } catch (e) {
    console.error("Server boot failed:", e);
    process.exit(1); // 치명적 오류 시 종료
  }
})();
