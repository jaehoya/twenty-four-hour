const express = require("express");
const router = express.Router();
const {
    createFolderController,
    getSubFoldersController,
    getFilesInFolderController,
    renameFolderController,
    deleteFolderController
} = require("../controllers/folder.controller");
const authenticateToken = require("../middlewares/auth");

/**
 * @swagger
 * /api/folders:
 *   post:
 *     summary: 새 폴더 생성
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               parentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 폴더 생성 성공
 */
router.post("/", authenticateToken, createFolderController);

/**
 * @swagger
 * /api/folders/{id}/subfolders:
 *   get:
 *     summary: 하위 폴더 조회
 *     tags: [Folders]
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
 *         description: 하위 폴더 목록 조회 성공
 */
router.get("/:id/subfolders", authenticateToken, getSubFoldersController);

/**
 * @swagger
 * /api/folders/{id}/files:
 *   get:
 *     summary: 폴더 내 파일 조회
 *     tags: [Folders]
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
 *         description: 폴더 내 파일 목록 조회 성공
 */
router.get("/:id/files", authenticateToken, getFilesInFolderController);


/**
 * @swagger
 * /api/folders/{id}/rename:
 *   put:
 *     summary: 폴더 이름 변경
 *     tags: [Folders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: 폴더 이름 변경 성공
 */
router.put("/:id/rename", authenticateToken, renameFolderController);


/**
 * @swagger
 * /api/folders/{id}:
 *   delete:
 *     summary: 폴더 삭제
 *     tags: [Folders]
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
 *         description: 폴더 삭제 성공
 */
router.delete("/:id", authenticateToken, deleteFolderController);

module.exports = router;