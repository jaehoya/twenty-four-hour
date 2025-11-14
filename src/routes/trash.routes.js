const express = require("express");
const router = express.Router();
const trashController = require("../controllers/trash.controller");
const auth = require("../middlewares/auth");

// 모든 라우트에 인증 미들웨어 적용
router.use(auth);

// GET /api/trash - 휴지통 파일 목록 조회
router.get("/", trashController.listTrashedFiles);

// POST /api/trash/:id/restore - 휴지통에서 파일 복원
router.post("/:id/restore", trashController.restoreTrashedFile);

// DELETE /api/trash/:id - 파일 영구 삭제
router.delete("/:id", trashController.deletePermanently);

module.exports = router;
