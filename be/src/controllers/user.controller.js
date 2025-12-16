const { 
  createUser, 
  loginUser, 
  logoutUser, 
  deleteUser: deleteUserService,
  changeUserPassword,
  requestPasswordReset,
  resetUserPassword 
} = require("../services/user.service");


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

// 로그인 요청 처리 컨트롤러
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });

    return res.status(200).json({
      message: "로그인 성공",
      ...result  // { user, accessToken, refreshToken }
    });
  } catch (err) {
    next(err);
  }
}

// 로그아웃 요청 처리 컨트롤러
async function logout(req, res, next) {
  try {
    // authMiddleware에서 추가한 req.user 객체에서 id를 가져옴
    const { id } = req.user;
    
    // 서비스 레이어 호출 -> DB에서 리프레시 토큰 삭제
    await logoutUser(id);

    return res.status(200).json({
       message: "로그아웃 성공",
       user: { id }
    });
  } catch (err) {
    next(err);
  }
}

// 회원 탈퇴 요청 처리 컨트롤러
async function deleteUser(req, res, next) {
  try {
    // authMiddleware에서 추가한 req.user 객체에서 id를 가져옴
    const { id, username } = req.user;

    // 서비스 레이어 호출 -> DB에서 사용자 삭제
    await deleteUserService(id, username, req.body.password);

    // 성공 응답
    return res.status(200).json({
      message: "회원 탈퇴 성공"
    });
  } catch (err) {
    next(err);
  }
}

// 비밀번호 변경 요청 처리 컨트롤러
async function changePassword(req, res, next) {
  try {
    // authMiddleware에서 추가한 req.user 객체에서 id를 가져옴
    const { id } = req.user;
    // req.body에서 현재 비밀번호와 새 비밀번호를 가져옴
    const { currentPassword, newPassword } = req.body;

    // 서비스 레이어 호출 -> DB에서 비밀번호 변경
    await changeUserPassword(id, currentPassword, newPassword);

    return res.status(200).json({
      message: "비밀번호 변경 성공"
    });
  } catch (err) {
    next(err);
  }
}

// 비밀번호 재설정 요청 처리 컨트롤러
async function forgotPassword(req, res, next) {
  try {
    // req.body에서 이메일 가져옴
    const { email } = req.body;

    // 서비스 호출 -> resetToken 생성 및 이메일 발송
    await requestPasswordReset(email);

    return res.status(200).json({
      message: "비밀번호 재설정 이메일이 전송되었습니다."
    });
  } catch (err) {
    next(err);
  }
}

// 비밀번호 재설정 처리 컨트롤러
async function resetPassword(req, res, next) {
  try {
    // req.body에서 이메일, 토큰, 새 비밀번호 가져옴
    const { email, token, newPassword } = req.body;

    // 서비스 호출 -> 토큰 검증 후 DB 비밀번호 업데이트
    await resetUserPassword(email, token, newPassword);

    return res.status(200).json({
      message: "비밀번호가 성공적으로 재설정되었습니다."
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { 
  signup, 
  login, 
  logout,
  deleteUser, 
  changePassword,
  forgotPassword,
  resetPassword
};

