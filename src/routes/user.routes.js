const express = require("express");
const router = express.Router();
const {
    signup, login, logout, deleteUser,
    changePassword, forgotPassword, resetPassword
} = require("../controllers/user.controller");
const {
    signupValidator,
    loginValidator,
    deleteUserValidator,
    changePasswordValidator,
    forgotPasswordValidator,
    resetPasswordValidator
} = require("../middlewares/validators/user.dto");
const authMiddleware = require("../middlewares/auth.js");

/**
 * @swagger
 * /api/users/signup:
 *   post:
 *     summary: 회원가입
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
router.post("/signup", signupValidator, signup);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: 로그인
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 */
router.post("/login", loginValidator, login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: 로그아웃
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 로그아웃 성공
 */
router.post("/logout", authMiddleware, logout);

/**
 * @swagger
 * /api/users/delete:
 *   delete:
 *     summary: 회원 탈퇴
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 회원 탈퇴 성공
 */
router.delete("/delete", authMiddleware, deleteUserValidator, deleteUser);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: 비밀번호 변경
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: 비밀번호 변경 성공
 */
router.put("/change-password", authMiddleware, changePasswordValidator, changePassword);

/**
 * @swagger
 * /api/users/forgot-password:
 *   post:
 *     summary: 비밀번호 재설정 요청
 *     description: 이메일로 비밀번호 재설정 링크를 전송합니다.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 이메일 전송 완료
 */
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);

/**
 * @swagger
 * /api/users/reset-password:
 *   post:
 *     summary: 비밀번호 재설정
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: 비밀번호 재설정 완료
 */
router.post("/reset-password", resetPasswordValidator, resetPassword);

module.exports = router;
