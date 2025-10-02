const express = require("express");
const router = express.Router();
const { 
  addFavoriteController, 
  removeFavoriteController, 
  getFavoritesController 
} = require("../controllers/favorite.controller");
const authenticateToken = require("../middlewares/auth");

// POST /api/favorites -> 즐겨찾기 추가
router.post("/", authenticateToken, addFavoriteController);

// DELETE /api/favorites -> 즐겨찾기 제거
router.delete("/", authenticateToken, removeFavoriteController);

// GET /api/favorites -> 즐겨찾기 목록 조회
router.get("/", authenticateToken, getFavoritesController);

module.exports = router;