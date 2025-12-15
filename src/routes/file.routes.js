const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const { uploadFile, getUserFiles, deleteFile, downloadFile, renameFile, previewFile } = require("../controllers/file.controller");
const authenticateToken = require("../middlewares/auth");

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: 파일 업로드
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 파일 업로드 성공
 */
router.post(
    "/upload",
    authenticateToken,
    upload.single("file"),
    uploadFile
);

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: 파일 목록 조회
 *     tags: [Files]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 파일 목록 조회 성공
 */
router.get("/", authenticateToken, getUserFiles);

/**
 * @swagger
 * /api/files/{id}/download:
 *   get:
 *     summary: 파일 다운로드
 *     tags: [Files]
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
 *         description: 파일 다운로드 성공
 */
router.get("/:id/download", authenticateToken, downloadFile);

/**
 * @swagger
 * /api/files/{id}/preview:
 *   get:
 *     summary: 파일 미리보기
 *     tags: [Files]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: token
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 파일 미리보기 성공
 */
router.get("/:id/preview", previewFile);

/**
 * @swagger
 * /api/files/{id}:
 *   delete:
 *     summary: 파일 삭제
 *     tags: [Files]
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
router.delete("/:id", authenticateToken, deleteFile);

/**
 * @swagger
 * /api/files/{id}/rename:
 *   patch:
 *     summary: 파일 이름 변경
 *     tags: [Files]
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
 *               newName:
 *                 type: string
 *     responses:
 *       200:
 *         description: 파일 이름 변경 성공
 */
router.patch("/:id/rename", authenticateToken, renameFile);

module.exports = router;