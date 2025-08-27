const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { uploadFile } = require("../controllers/file.controller");
const authenticateToken = require("../middlewares/auth");

// POST /api/files/upload -> 파일 업로드 (필드명: file)
router.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    uploadFile
);

module.exports = router;
