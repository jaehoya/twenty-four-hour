const express = require("express");
const router = express.Router();
const {
  addFavoriteController,
  removeFavoriteController,
  getFavoritesController
} = require("../controllers/favorite.controller");
const authenticateToken = require("../middlewares/auth");

/**
 * @swagger
 * /api/favorites:
 *   post:
 *     summary: 즐겨찾기 추가
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetId:
 *                 type: integer
 *               targetType:
 *                 type: string
 *     responses:
 *       201:
 *         description: 즐겨찾기 추가 성공
 */
router.post("/", authenticateToken, addFavoriteController);

/**
 * @swagger
 * /api/favorites:
 *   delete:
 *     summary: 즐겨찾기 제거
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetId:
 *                 type: integer
 *               targetType:
 *                 type: string
 *     responses:
 *       200:
 *         description: 즐겨찾기 제거 성공
 */
router.delete("/", authenticateToken, removeFavoriteController);

/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: 즐겨찾기 목록 조회
 *     tags: [Favorites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 즐겨찾기 목록 조회 성공
 */
router.get("/", authenticateToken, getFavoritesController);

module.exports = router;