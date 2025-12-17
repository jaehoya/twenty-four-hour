const bcrypt = require("bcrypt");  // 비밀번호 해시 라이브러리
const jwt = require("jsonwebtoken");  // JWT 발급 라이브러리
const { Sequelize } = require("sequelize");  // Sequelize 에러 객체 활용
const crypto = require("crypto");  // 랜덤 토큰 생성
const { sendMail } = require("../utils/mailer");  // 이메일 전송 함수
const User = require("../models/user");  // User 모델 불러오기

// bcrypt 해시 강도 (기본 10, .env에서 BCRYPT_SALT_ROUNDS 가져오기)
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10);

/**
 * 회원가입 서비스
 * - 이메일/username 중복 체크 
 * - 비밀번호 bycrypt 해시 후 저장
 * - 민감 정보 제외한 유저 데이터 반환
 */
async function createUser({ email, username, password }) {
  // 이메일 중복 체크
  if (await User.findOne({ where: { email } })) {
    const err = new Error("이미 사용 중인 이메일입니다.");
    err.status = 409; err.code = "EMAIL_TAKEN";
    throw err;
  }

  // username 중복 체크
  if (await User.findOne({ where: { username } })) {
    const err = new Error("이미 사용 중인 username입니다.");
    err.status = 409; err.code = "USERNAME_TAKEN";
    throw err;
  }

  // 비밀번호 해시 (평문 저장 X, 항상 bcrypt 해시 저장)
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  try {
    // 새 유저 생성
    const user = await User.create({
      email,
      username,
      password: hashedPassword
    });

    // 응답에서 민감 정보(password)는 제외
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt
    };
  } catch (e) {
    // 유니크 제약 조건 위반 (동시에 가입 시도 등)
    if (e instanceof Sequelize.UniqueConstraintError) {
      const field = e.errors?.[0]?.path;
      const err = new Error(
        field === "email"
          ? "이미 사용 중인 이메일입니다."
          : "이미 사용 중인 username입니다."
      );
      err.status = 409;
      err.code = field === "email" ? "EMAIL_TAKEN" : "USERNAME_TAKEN";
      throw err;
    }
    throw e; // 다른 DB 에러는 그대로 던짐
  }
}

/**
 * 로그인 서비스
 * - 이메일로 유저 조회
 * - 비밀번호 bycrypt.compare로 검증
 * - JWT AccessToken + RefreshToken 발급
 * - 민감 정보 제외한 유저 데이터와 토큰 반환
 */
async function loginUser({ email, password }) {
  // 이메일로 유저 조회
  const user = await User.findOne({ where: { email }});
  if(!user) {
    const err = new Error("잘못된 이메일 또는 비밀번호입니다.");
    err.status = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  // 비밀번호 비교
  const isMatch = await bcrypt.compare(password, user.password);
  if(!isMatch) {
    const err = new Error("잘못된 이메일 또는 비밀번호입니다.");
    err.status = 401;
    err.code = "INVALID_CREDENTIALS";
    throw err;
  }

  // JWT AccessToken 발급 (15분 유효)
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },  // payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1h"}
  );

  // JWT RefreshToken 발급 (7일 유효)
  const refreshToken = jwt.sign(
    { id: user.id, email: user.email },  // payload
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "14d" }
  );
      // RefreshToken을 DB에 저장
  user.refreshToken = refreshToken;
  await user.save();

  // 응답에서 민감 정보 제외
  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    accessToken,
    refreshToken,
  };
}

/**
 * 로그아웃 서비스
 * - DB에서 RefreshToken을 제거
 */
async function logoutUser(id) {
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error("사용자를 찾을 수 없습니다.");
    err.status = 404;
    err.code = "USER_NOT_FOUND";
    throw err;
  }
  if (user.refreshToken !== null) {
    // DB에서 리프레시 토큰 삭제 (무효화)
    user.refreshToken = null;
    await user.save();
  } 
}

/**
 * 회원 탈퇴 서비스
 * - id로 사용자 조회 후 삭제
 */
async function deleteUser(id, username, password) {
  const user = await User.findOne({ where: { id, username } });
  if (!user) {
    const err = new Error("사용자를 찾을 수 없습니다.");
    err.status = 404;
    err.code = "USER_NOT_FOUND";
    throw err;
  }

  // 비밀번호 확인
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("잘못된 비밀번호입니다.");
    err.status = 401;
    err.code = "INVALID_PASSWORD";
    throw err;
  }

  const deletedRowCount = await User.destroy({
    where: { id },
  });

  // 삭제된 행이 없으면 사용자가 없다는 뜻
  if (deletedRowCount === 0) {
    const err = new Error("해당 사용자를 찾을 수 없습니다.");
    err.status = 404;
    err.code = "USER_NOT_FOUND";
    throw err;
  }

  return true;
}

/**
 * 비밀번호 변경 서비스
 * - userId로 사용자 조회
 * - 현재 비밀번호 검증 (bcrypt.compare)
 * - 새 비밀번호 해시 후 저장
 */
async function changeUserPassword(id, currentPassword, newPassword) {
  // 사용자 조회
  const user = await User.findByPk(id);
  if (!user) {
    const err = new Error("사용자를 찾을 수 없습니다.");
    err.status = 404;
    err.code = "USER_NOT_FOUND";
    throw err;
  }

  // 기존 비밀번호 확인
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    const err = new Error("현재 비밀번호가 일치하지 않습니다.");
    err.status = 400;
    err.code = "INVALID_CURRENT_PASSWORD";
    throw err;
  }

  // 새 비밀번호 해시 후 저장
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
  user.password = hashedNewPassword;
  await user.save();

  return true; 
}

/**
 * 비밀번호 재설정 요청 서비스
 * - 이메일로 사용자 조회
 * - 랜덤 토큰 생성 (crypto) 및 만료 시간 저장
 * - 비밀번호 재설정 링크를 이메일로 발송
 */
async function requestPasswordReset(email) {
  // 이메일로 사용자 조회
  const user = await User.findOne({ where: { email} });
  if (!user) {
    const err = new Error("해당 이메일의 사용자를 찾을 수 없습니다.");
    err.status = 404;
    err.code = "USER_NOT_FOUND";
    throw err;
  }

  // 토큰 생성 (랜덤 32바이트 16진수)
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 3600000);  // 1시간

  // DB에 토큰과 만료 시간 저장
  user.resetToken = token;
  user.resetTokenExpiry = expires;
  await user.save();

  // 비밀번호 재설정 링크를 이메일로 발송
  const resetLink = `http://localhost:5173/reset-password?token=${token}&email=${email}`;
  await sendMail(
  user.email,
  "비밀번호 재설정 안내",
  `아래 링크를 눌러 비밀번호를 재설정 하세요: ${resetLink}`, 
  `<p>아래 링크를 눌러 비밀번호를 재설정 하세요:</p>
   <a href="${resetLink}">${resetLink}</a>
   <p>이 링크는 1시간 동안만 유효합니다.</p>` 
);

  return true;
}

/**
 * 비밀번호 재설정 서비스
 * - 이메일, 토큰 검증
 * - 새 비밀번호 해시 후 저장
 */
async function resetUserPassword(email, token, newPassword) {
  // 이메일로 사용자 조회
  const user = await User.findOne({ where: { email } });
  if (!user) {
    const err = new Error("사용자를 찾을 수 없습니다.");
    err.status = 404;
    err.code = "USER_NOT_FOUND";
    throw err;
  }

  // 토큰 검증
  if (
    !user.resetToken ||
    user.resetToken !== token ||
    !user.resetTokenExpiry ||
    user.resetTokenExpiry < Date.now()
  ) {
    const err = new Error("토큰이 유효하지 않거나 만료되었습니다.");
    err.status = 400;
    err.code = "INVALID_OR_EXPIRED_TOKEN";
    throw err;
  }

  // 새 비밀번호 해시 후 저장
  const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
  user.password = hashedNewPassword;

  // 토큰 무효화
  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();
  return true;
}

module.exports = { 
  createUser, 
  loginUser, 
  logoutUser, 
  deleteUser,
  changeUserPassword,
  requestPasswordReset,
  resetUserPassword
};
