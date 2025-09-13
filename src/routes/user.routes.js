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

// POST /api/users/signup → 회원가입
router.post("/signup", signupValidator, signup);

// POST /api/users/login -> 로그인
router.post("/login", loginValidator, login);

// POST /api/users/logout -> 로그아웃
router.post("/logout", authMiddleware, logout);

// DELETE /api/users/delete -> 회원 탈퇴
router.delete("/delete", authMiddleware, deleteUserValidator, deleteUser);

// PUT /api/users/change-password -> 비밀번호 변경 
router.put("/change-password", authMiddleware, changePasswordValidator, changePassword);

// POST /api/users/forgot-password -> 비밀번호 재설정 요청 (토큰 발급 & 메일 전송)
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);

// POST /api/users/reset-password -> 비밀번호 재설정
router.post("/reset-password", resetPasswordValidator, resetPassword);

module.exports = router;
