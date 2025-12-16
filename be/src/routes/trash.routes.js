const express = require("express");
const router = express.Router();
const trashController = require("../controllers/trash.controller");
const auth = require("../middlewares/auth");

// 모든 라우트에 인증 미들웨어 적용
router.use(auth);

/**
 * @swagger
 * /api/trash:
 *   get:
 *     summary: 휴지통 파일 목록 조회
 *     tags: [Trash]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 목록 조회 성공
 */
router.get("/", trashController.listTrashedFiles);

/**
 * @swagger
 * /api/trash/{id}/restore:
 *   post:
 *     summary: 휴지통 파일 복원
 *     tags: [Trash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 파일 복원 성공
 */
router.post("/:id/restore", trashController.restoreTrashedFile);

/**
 * @swagger
 * /api/trash/{id}:
 *   delete:
 *     summary: 파일 영구 삭제
 *     tags: [Trash]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 파일 삭제 성공
 */
router.delete("/:id", trashController.deletePermanently);

module.exports = router;
