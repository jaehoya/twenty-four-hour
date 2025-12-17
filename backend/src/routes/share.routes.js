const express = require("express");
const router = express.Router();
const shareController = require("../controllers/share.controller");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * /api/shares:
 *   post:
 *     summary: 공유 링크 생성
 *     tags: [Shares]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fileId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 공유 링크 생성 성공
 */
router.post("/", auth, shareController.createShareLink);

/**
 * @swagger
 * /api/shares/{token}:
 *   get:
 *     summary: 공유 파일 접근
 *     tags: [Shares]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 파일 접근 성공
 */
router.get("/:token", shareController.accessSharedFile);

module.exports = router;
