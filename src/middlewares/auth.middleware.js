const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function authMiddleware(req, res, next) {
  // 1. Authorization 헤더에서 토큰 추출
  // 형식: "Bearer <token>"
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    const err = new Error("인증 정보가 필요합니다.");
    err.status = 401;
    err.code = "MISSING_AUTHORIZATION";
    return next(err);
  }
  const token = authHeader.split(" ")[1];

  try {
    // 2. JWT 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. 토큰 payload의 id로 사용자 정보 조회
    const user = await User.findByPk(decoded.id);
    if (!user) {
      const err = new Error("유효하지 않은 토큰입니다. 사용자를 찾을 수 없습니다.");
      err.status = 401;
      err.code = "INVALID_TOKEN";
      return next(err);
    }

    // 4. req 객체에 사용자 정보 저장
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    // 5. 다음 미들웨어로 전달
    next();
  } catch (error) {
    // 토큰 만료 또는 검증 실패
    const err = new Error("인증에 실패했습니다. 토큰이 유효하지 않거나 만료되었습니다.");
    err.status = 401;
    err.code = "AUTHENTICATION_FAILED";
    next(err);
  }
}

module.exports = authMiddleware;
