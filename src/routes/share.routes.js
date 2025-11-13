const express = require("express");
const router = express.Router();
const shareController = require("../controllers/share.controller");
const auth = require("../middlewares/auth");

// POST /api/shares - 공유 링크 생성
// 인증된 사용자만 파일 공유 링크를 생성할 수 있음
router.post("/", auth, shareController.createShareLink);

// GET /api/shares/:token - 공유 링크를 통해 파일 접근
// 인증 없이 누구나 공유된 파일에 접근할 수 있음
router.get("/:token", shareController.accessSharedFile);

module.exports = router;
