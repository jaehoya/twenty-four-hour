const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { uploadFile, getUserFiles, deleteFile, downloadFile, renameFile, previewFile } = require("../controllers/file.controller");
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

// GET /api/files/:id/download -> 파일 다운로드
router.get("/:id/download", authenticateToken, downloadFile);

// GET /api/files/:id/preview -> 파일 미리보기
router.get("/:id/preview", authenticateToken, previewFile);

// DELETE /api/files/:id -> 파일 삭제
router.delete("/:id", authenticateToken, deleteFile);

// PATCH /api/files/:id/rename -> 파일 이름 변경
router.patch("/:id/rename", authenticateToken, renameFile);

module.exports = router;