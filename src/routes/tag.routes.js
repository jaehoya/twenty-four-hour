const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const {
  getFileTags,
  addTag,
  deleteTag,
  updateAllTags,
  searchFilesByTag,
  requestAiTagController,
} = require("../controllers/tag.controller");

// 태그 검색 
router.get("/search/files", authenticateToken, searchFilesByTag);

// AI 태그 추천 요청
router.post("/:fileId/ai", authenticateToken, requestAiTagController);

// 특정 파일의 태그 조회 
router.get("/:fileId", authenticateToken, getFileTags);

// 태그 추가 
router.post("/:fileId", authenticateToken, addTag);

// 태그 전체 수정 
router.put("/:fileId", authenticateToken, updateAllTags);

//특정 태그 삭제 
router.delete("/:fileId/:tagId", authenticateToken, deleteTag);

module.exports = router;
