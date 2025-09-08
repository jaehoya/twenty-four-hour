const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { uploadFile, getUserFiles, deleteFile } = require("../controllers/file.controller");
const authenticateToken = require("../middlewares/auth");

// POST /api/files/upload -> 파일 업로드 (필드명: file)
router.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    uploadFile
);

// GET /api/files -> 사용자 파일 목록 조회 (검색, 정렬)
router.get("/", authenticateToken, getUserFiles);

// DELETE /api/files/:id -> 파일 삭제
router.delete("/:id", authenticateToken, deleteFile);

module.exports = router;