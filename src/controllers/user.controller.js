const { createUser } = require("../services/user.service");

// 회원가입 요청 처리 컨트롤러
async function signup(req, res, next) {
  try {
    // req.body에서 email, username, password 꺼내기
    const { email, username, password } = req.body;

    // 서비스 레이어 호출 → 실제 DB 저장
    const user = await createUser({ email, username, password });

    // 성공 응답
    return res.status(201).json({
      message: "회원가입 성공",
      user
    });
  } catch (err) {
    // 에러 발생 시 에러 핸들러로 전달
    next(err);
  }
}

module.exports = { signup };
