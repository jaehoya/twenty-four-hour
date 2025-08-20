const bcrypt = require("bcrypt"); // 비밀번호 해시 라이브러리
const { Sequelize } = require("sequelize"); // Sequelize 에러 객체 활용
const User = require("../models/user"); // User 모델 불러오기

// bcrypt 해시 강도 (기본 10, .env에서 BCRYPT_SALT_ROUNDS 가져오기)
const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? "10", 10);

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

module.exports = { createUser };
