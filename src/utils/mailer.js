const nodemailer = require("nodemailer");

// Gmail SMTP 연결 (환경변수 사용)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,  // Gmail 주소
    pass: process.env.EMAIL_PASS   // 앱 비밀번호
  },
});

// 이메일 전송 함수
async function sendMail(to, subject, text, html) {
  try {
    const info = await transporter.sendMail({
      from: `"MyAPP" <${process.env.EMAIL_USER}>`,  // ✅ 템플릿 문자열 수정
      to,      // 받는 사람 이메일
      subject, // 메일 제목
      text,    // 텍스트 본문
      html,    // HTML 본문
    });

    console.log("메일 전송 성공:", info.messageId);
    return info;
  } catch (err) {
    console.error("메일 전송 실패:", err);
    throw err;
  }
}

module.exports = { sendMail };
