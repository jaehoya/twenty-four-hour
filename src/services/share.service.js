const { File, Share, User } = require("../models");
const crypto = require("crypto");

// AppError 클래스 정의 (response.js 파일이 비어있으므로)
class AppError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/**
 * 파일 공유 링크를 생성하는 서비스 함수
 * @param {number} fileId - 공유할 파일의 ID
 * @param {number} userId - 파일 소유자의 ID
 * @returns {Share} 생성된 공유 객체
 * @throws {AppError} 파일이 없거나 공유 권한이 없을 경우
 */
const createShare = async (fileId, userId) => {
  // 파일 존재 여부 및 소유자 확인
  const file = await File.findOne({ where: { id: fileId, user_id: userId } });
  if (!file) {
    throw new AppError(404, "FILE_NOT_FOUND", "파일을 찾을 수 없거나 공유할 권한이 없습니다.");
  }

  // 고유한 공유 토큰 생성
  const token = crypto.randomBytes(16).toString("hex");

  // Share 테이블에 공유 정보 저장
  const share = await Share.create({
    fileId,
    token,
    // expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 예: 7일 후 만료
  });

  return share;
};

/**
 * 공유 링크를 통해 파일을 조회하는 서비스 함수
 * @param {string} token - 공유 링크의 고유 토큰
 * @returns {File} 공유된 파일 객체
 * @throws {AppError} 링크를 찾을 수 없거나 만료되었을 경우
 */
const getSharedFile = async (token) => {
  // 토큰으로 공유 정보 조회 및 관련 파일, 사용자 정보 포함
  const share = await Share.findOne({
    where: { token },
    include: [{ model: File, include: [User] }]
  });

  if (!share) {
    throw new AppError(404, "LINK_NOT_FOUND", "공유 링크를 찾을 수 없습니다.");
  }

  // 공유 링크 만료 여부 확인
  if (share.expiresAt && share.expiresAt < new Date()) {
    throw new AppError(410, "LINK_EXPIRED", "공유 링크가 만료되었습니다.");
  }

  return share.File;
};

module.exports = {
  createShare,
  getSharedFile,
};
