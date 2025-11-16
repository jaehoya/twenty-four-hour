const express = require("express");
const router = express.Router();
const shareController = require("../controllers/share.controller");
const auth = require("../middlewares/auth");

// POST /api/shares -> 공유 링크 생성
router.post("/", auth, shareController.createShareLink);

// GET /api/shares/:token -> 공유 링크를 통해 파일 접근
router.get("/:token", shareController.accessSharedFile);

module.exports = router;
