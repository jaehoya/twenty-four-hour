const express = require("express");
const router = express.Router();
const authenticateToken = require("../middlewares/auth");

const {
  getFileTagsController,
  addTagController,
  deleteTagController,
  updateAllTagsController,
  searchFilesByTagController,
  requestAiTagController,
} = require("../controllers/tag.controller");

// 태그 검색 
router.get("/search/files", authenticateToken, searchFilesByTagController);

// AI 태그 추천 요청
router.post("/:fileId/ai", authenticateToken, requestAiTagController);

// 특정 파일의 태그 조회 
router.get("/:fileId", authenticateToken, getFileTagsController);

// 태그 추가 
router.post("/:fileId", authenticateToken, addTagController);

// 태그 전체 수정 
router.put("/:fileId", authenticateToken, updateAllTagsController);

//특정 태그 삭제 
router.delete("/:fileId/:tagId", authenticateToken, deleteTagController);

module.exports = router;
