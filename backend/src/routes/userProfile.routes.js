const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userProfile.controller");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { updateProfileValidator } = require("../middlewares/validators/user.dto");

/**
 * @swagger
 * /api/profile/me:
 *   get:
 *     summary: 내 프로필 조회
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 프로필 조회 성공
 */
router.get("/me", authMiddleware, userProfileController.getProfile);

/**
 * @swagger
 * /api/profile/me:
 *   put:
 *     summary: 내 프로필 수정
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               profileImage:
 *                 type: string
 *                 format: binary
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: 프로필 수정 성공
 */
router.put("/me", authMiddleware, upload.single('profileImage'), updateProfileValidator, userProfileController.updateProfile);

module.exports = router;
