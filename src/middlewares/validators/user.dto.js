const { body, validationResult } = require("express-validator");

const signupValidator = [
  // email: 필수, 이메일 형식, 최대 120자  (User.js: STRING(120))
  body("email")
    .trim()
    .isEmail().withMessage("유효한 이메일을 입력하세요.")
    .isLength({ max: 120 }).withMessage("이메일은 최대 120자입니다."),

  // username: 필수, 2~50자, 영문/숫자/한글/밑줄만 허용  (User.js: STRING(50))
  body("username")
    .trim()
    .isLength({ min: 2, max: 20 }).withMessage("username은 2~20자입니다.")
    .matches(/^[a-zA-Z0-9가-힣_]+$/).withMessage("영문/숫자/한글/밑줄(_)만 허용합니다."),

  // password: 필수, 8~100자  (User.js: STRING(100) - bcrypt 해시 저장 예정)
  body("password")
    .isString().withMessage("비밀번호는 문자열이어야 합니다.")
    .isLength({ min: 8, max: 64 }).withMessage("비밀번호는 8~64자입니다."),

  // 검증 결과 처리
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        code: "VALIDATION_ERROR",
        errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
      });
    }
    next();
  }
];

module.exports = { signupValidator };
