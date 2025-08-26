const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/user.controller");
const { signupValidator, loginValidator } = require("../middlewares/validators/user.dto");

// POST /api/users/signup → 회원가입
router.post("/signup", signupValidator, signup);

// POST /api/users/login -> 로그인
router.post("/login", loginValidator, login);

module.exports = router;
