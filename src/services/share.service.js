const { File, Share, User } = require("../models");
const crypto = require("crypto");
const { AppError } = require("../utils/response");

const createShare = async (fileId, userId) => {
  const file = await File.findOne({ where: { id: fileId, user_id: userId } });
  if (!file) {
    throw new AppError(404, "FILE_NOT_FOUND", "파일을 찾을 수 없거나 공유할 권한이 없습니다.");
  }

  const token = crypto.randomBytes(16).toString("hex");

  const share = await Share.create({
    fileId,
    token,
    // expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 예: 7일 후 만료
  });

  return share;
};

const getSharedFile = async (token) => {
  const share = await Share.findOne({
    where: { token },
    include: [{ model: File, include: [User] }]
  });

  if (!share) {
    throw new AppError(404, "LINK_NOT_FOUND", "공유 링크를 찾을 수 없습니다.");
  }

  if (share.expiresAt && share.expiresAt < new Date()) {
    throw new AppError(410, "LINK_EXPIRED", "공유 링크가 만료되었습니다.");
  }

  return share.File;
};

module.exports = {
  createShare,
  getSharedFile,
};
