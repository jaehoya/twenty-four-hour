const express = require("express");
const router = express.Router();
const { signup, login, logout, deleteUser } = require("../controllers/user.controller");
const { signupValidator, loginValidator } = require("../middlewares/validators/user.dto");
const authMiddleware = require("../middlewares/auth.middleware");

// POST /api/users/signup → 회원가입
router.post("/signup", signupValidator, signup);

// POST /api/users/login -> 로그인
router.post("/login", loginValidator, login);

// POST /api/users/logout -> 로그아웃
router.post("/logout", authMiddleware, logout);

// DELETE /api/users -> 회원 탈퇴
router.delete("/", authMiddleware, deleteUser);

module.exports = router;
