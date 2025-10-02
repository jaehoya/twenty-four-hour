/**
 * JWT 인증 미들웨어
 * - 요청 헤더의 Authorization에서 토큰 추출
 * - 유효한 토큰인지 검증 후 req.user에 디코딩된 사용자 정보 주입
 * - 실패 시 401(토큰 없음) 또는 403(토큰 무효) 반환
 */

const jwt = require("jsonwebtoken");
const User = require("../models/user");

// 인증 미들웨어 함수
async function authenticateToken(req, res, next) {
  try {
    // 1) Authorization 헤더에서 Bearer 토큰 파싱 (대소문자 무시)
    const authHeader = req.headers["authorization"] || "";
    const match = authHeader.match(/^Bearer\s+(.+)$/i);
    if (!match) {
      return res.status(401).json({
        state: 401,
        code: "NO_TOKEN",
        message: "토큰이 존재하지 않습니다.",
      });
    }
    const token = match[1].trim();

    // 2) JWT 검증
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      const isExpired = err.name === "TokenExpiredError";
      return res.status(403).json({
        state: 403,
        code: isExpired ? "TOKEN_EXPIRED" : "INVALID_TOKEN",
        message: isExpired ? "토큰이 만료되었습니다." : "유효하지 않은 토큰입니다.",
      });
    }

    // 3) 토큰 payload의 id로 사용자 조회
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(403).json({
        state: 403,
        code: "INVALID_TOKEN",
        message: "유효하지 않은 토큰입니다. 사용자를 찾을 수 없습니다.",
      });
    }

    // 4) 요청 컨텍스트에 사용자 정보 주입
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    // 5) 다음 미들웨어로
    return next();
  } catch (err) {
    // DB 오류 등 기타 예외는 공용 에러 핸들러로
    return next(err);
  }
}
module.exports = authenticateToken;