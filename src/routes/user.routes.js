const express = require("express");
const router = express.Router();

const { signup } = require("../controllers/user.controller");
const { signupValidator } = require("../middlewares/validators/user.dto");

// POST /api/users/signup → 회원가입
// signupValidator: 입력값 검증 → signup: 컨트롤러 실행
router.post("/signup", signupValidator, signup);

module.exports = router;
