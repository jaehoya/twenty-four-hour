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

/**
 * @swagger
 * /api/tags/search/files:
 *   get:
 *     summary: 태그로 파일 검색
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: tag
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 검색 성공
 */
router.get("/search/files", authenticateToken, searchFilesByTagController);

/**
 * @swagger
 * /api/tags/{fileId}/ai:
 *   post:
 *     summary: AI 태그 추천 요청
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: AI 태그 추천 요청 성공
 */
router.post("/:fileId/ai", authenticateToken, requestAiTagController);

/**
 * @swagger
 * /api/tags/{fileId}:
 *   get:
 *     summary: 파일 태그 조회
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 태그 조회 성공
 */
router.get("/:fileId", authenticateToken, getFileTagsController);

/**
 * @swagger
 * /api/tags/{fileId}:
 *   post:
 *     summary: 태그 추가
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tag:
 *                 type: string
 *     responses:
 *       201:
 *         description: 태그 추가 성공
 */
router.post("/:fileId", authenticateToken, addTagController);

/**
 * @swagger
 * /api/tags/{fileId}:
 *   put:
 *     summary: 태그 전체 수정
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: 태그 수정 성공
 */
router.put("/:fileId", authenticateToken, updateAllTagsController);

/**
 * @swagger
 * /api/tags/{fileId}/{tagId}:
 *   delete:
 *     summary: 태그 삭제
 *     tags: [Tags]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: fileId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 태그 삭제 성공
 */
router.delete("/:fileId/:tagId", authenticateToken, deleteTagController);

module.exports = router;
