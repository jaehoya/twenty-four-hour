const express = require("express");
const router = express.Router();
const { signup, login, logout, deleteUser, changePassword } = require("../controllers/user.controller");
const { 
    signupValidator, 
    loginValidator,
    deleteUserValidator,
    changePasswordValidator
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

module.exports = router;
