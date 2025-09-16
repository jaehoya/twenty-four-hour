const { body, validationResult } = require("express-validator");

// 공통 검증 결과 처리
function handleValidationResult(req, res, next) {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        state: 400,
        code: "VALIDATION_ERROR",
        errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
      });
    }
  next();
}

// 회원가입 검증
const signupValidator = [
  // email: 필수, 이메일 형식, 최대 120자  
  body("email")
    .trim()
    .isEmail().withMessage("유효한 이메일을 입력하세요.")
    .isLength({ max: 120 }).withMessage("이메일은 최대 120자입니다."),

  // username: 필수, 2~20자, 영문/숫자/한글/밑줄만 허용  
  body("username")
    .trim()
    .isLength({ min: 2, max: 20 }).withMessage("username은 2~20자입니다.")
    .matches(/^[a-zA-Z0-9가-힣_]+$/).withMessage("영문/숫자/한글/밑줄(_)만 허용합니다."),

  // password: 필수, 8~64자
  body("password")
    .isString().withMessage("비밀번호는 문자열이어야 합니다.")
    .isLength({ min: 8, max: 64 }).withMessage("비밀번호는 8~64자입니다."),

  // 검증 결과 처리
  handleValidationResult
];

//로그인 검증
const loginValidator = [
  // email: 필수, 이메일 형식만 확인
  body("email")
    .trim()
    .isEmail().withMessage("유효한 이메일을 입력하세요."),

  // password: 필수, 8~64자
  body("password")
    .isString().withMessage("비밀번호는 문자열이어야 합니다.")
    .isLength({ min: 8, max: 64 }).withMessage("비밀번호는 8~64자입니다."),

  // 검증 결과 처리
  handleValidationResult
];

// 회원탈퇴 검증
const deleteUserValidator = [
  // password: 필수, 8~64자
  body("password")
    .isString().withMessage("비밀번호는 문자열이어야 합니다.")
    .isLength({ min: 8, max: 64 }).withMessage("비밀번호는 8~64자입니다."),

  // 검증 결과 처리
  handleValidationResult
];

// 비밀번호 변경 검증
const changePasswordValidator = [
  // currentPassword: 필수, 8~64자
  body("currentPassword")
    .isString().withMessage("비밀번호는 문자열이어야 합니다.")
    .isLength({ min: 8, max: 64 }).withMessage("비밀번호는 8~64자입니다."),

  // newPassword: 필수, 8~64자
  body("newPassword")
    .isString().withMessage("비밀번호는 문자열이어야 합니다.")
    .isLength({ min: 8, max: 64 }).withMessage("비밀번호는 8~64자입니다."), 
    
  // 검증 결과 처리
  handleValidationResult
];

// 비밀번호 재설정 요청 검증
const forgotPasswordValidator = [
  // email: 필수, 이메일 형식, 최대 120자  
  body("email")
    .trim()
    .isEmail().withMessage("유효한 이메일을 입력하세요.")
    .isLength({ max: 120 }).withMessage("이메일은 최대 120자입니다."),

  // 검증 결과 처리
  handleValidationResult
];

// 비밀번호 재설정 완료 검증
const resetPasswordValidator = [
  // email: 필수, 이메일 형식, 최대 120자  
  body("email")
    .trim()
    .isEmail().withMessage("유효한 이메일을 입력하세요.")
    .isLength({ max: 120 }).withMessage("이메일은 최대 120자입니다."),

  // token: 필수, 문자열
  body("token")
    .isString().withMessage("토큰은 문자열이어야 합니다."),

  // newPassword: 필수, 8~64자
  body("newPassword")
    .isString().withMessage("비밀번호는 문자열이어야 합니다.")
    .isLength({ min: 8, max: 64 }).withMessage("비밀번호는 8~64자입니다."),

  // 검증 결과 처리
  handleValidationResult
];

module.exports = { 
  signupValidator, 
  loginValidator, 
  deleteUserValidator, 
  changePasswordValidator,
  forgotPasswordValidator,
  resetPasswordValidator 
};
