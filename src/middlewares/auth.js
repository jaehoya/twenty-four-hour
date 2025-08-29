/**
 * JWT 인증 미들웨어
 * - 요청 헤더의 Authorization에서 토큰 추출
 * - 유효한 토큰인지 검증 후 req.user에 디코딩된 사용자 정보 주입
 * - 실패 시 401(토큰 없음) 또는 403(토큰 무효) 반환
 */

const jwt = require("jsonwebtoken");

// 인증 미들웨어 함수
function authenticateToken(req, res, next) {
    // Authorization 헤더에서 토큰 추출
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // 토큰이 없으면 401 Unauthorized
    if(!token) {
        return res.status(401).json({
            state: 401,
            code: "NO_TOKEN",
            message: "토큰이 없습니다."
        });
    }

    // 토큰 검증
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if(err) {
            return res.status(403).json({
                state: 403,
                code: "INVALID_TOKEN",
                message: "유효하지 않은 토큰입니다."
            });
        }

        req.user = decoded;  // { id: user.id, email: user.email }
        next();
    });
}

module.exports = authenticateToken;