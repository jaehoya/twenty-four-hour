const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const {
  getFileTags,
  addTag,
  deleteTag,
  updateAllTags,
  searchFilesByTag,
  recommendTags
} = require("../controllers/tag.controller");

// 특정 파일의 태그 조회
router.get("/:fileId", authenticateToken, getFileTags);

// 태그 추가
router.post("/:fileId", authenticateToken, addTag);

// 태그 삭제
router.delete("/:fileId/:tagId", authenticateToken, deleteTag);

// 태그 전체 수정 (기존 태그 삭제 후 새 태그 생성)
router.put("/:fileId", authenticateToken, updateAllTags);

// 태그 검색 (tag=xxx)
router.get("/search/files", authenticateToken, searchFilesByTag);

// AI 태그 추천
router.get("/:fileId/recommend", authenticateToken, recommendTags);

module.exports = router;
