const { File } = require("../models");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

/**
 * 휴지통에 있는 파일 목록 조회
 * @param {number} userId - 사용자 ID
 */
async function getTrashedFiles(userId) {
    const files = await File.findAll({
        where: {
            user_id: userId,
            deletedAt: { [Op.ne]: null } // deletedAt이 null이 아닌 경우
        },
        paranoid: false, // 소프트 삭제된 항목을 포함하여 조회
    });
    return files;
}

/**
 * 휴지통에서 파일 복원
 * @param {number} userId - 사용자 ID
 * @param {number} fileId - 파일 ID
 */
async function restoreFile(userId, fileId) {
    const file = await File.findOne({
        where: { id: fileId, user_id: userId },
        paranoid: false,
    });

    if (!file) {
        const error = new Error("파일을 찾을 수 없거나 복원할 권한이 없습니다.");
        error.status = 404;
        throw error;
    }

    await file.restore();
}

/**
 * 파일 영구 삭제
 * @param {number} userId - 사용자 ID
 * @param {number} fileId - 파일 ID
 */
async function permanentlyDeleteFile(userId, fileId) {
    const file = await File.findOne({
        where: { id: fileId, user_id: userId },
        paranoid: false,
    });

    if (!file) {
        const error = new Error("파일을 찾을 수 없거나 삭제할 권한이 없습니다.");
        error.status = 404;
        throw error;
    }

    // 실제 파일 삭제
    const filePath = path.join(__dirname, "../..", file.path);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(`파일 시스템에서 파일 삭제 실패: ${filePath}`, err);
        }
    });

    // 데이터베이스에서 영구 삭제
    await file.destroy({ force: true });
}

module.exports = {
    getTrashedFiles,
    restoreFile,
    permanentlyDeleteFile,
};
