const { File } = require("../models");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

/**
 * 파일 메타데이터 저장
 * -userId: 업로드한 사용자 ID (req.user.id에서 주입됨)
 * -file: multer가 제공하는 파일 객체
 */
async function saveFileMetadata(userId, file) {
    return await File.create({
        user_id: userId,
        original_name: file.originalname,
        stored_name: file.filename,
        mime_type: file.mimetype,
        size: file.size,
        path: "src/uploads/" + file.filename,
    });
}

/**
 * 사용자 ID로 파일 목록 조회 (검색 및 정렬 기능 추가)
 * @param {number} userId - 사용자 ID
 * @param {string} search - 검색어
 * @param {string} sortBy - 정렬 기준 (createdAt, original_name, size)
 * @param {string} sortOrder - 정렬 순서 (ASC, DESC)
 */
async function getFilesByUserId(userId, search, sortBy, sortOrder) {
    const where = { user_id: userId };
    if (search) {
        // NOTE: MySQL's default behavior for LIKE is case-insensitive.
        where.original_name = { [Op.like]: `%${search}%` };
    }

    const order = [];
    if (sortBy) {
        order.push([sortBy, sortOrder || "ASC"]);
    } else {
        order.push(["createdAt", "DESC"]);
    }

    return await File.findAll({ where, order });
}

/**
 * 파일 ID와 사용자 ID로 파일 삭제
 * @param {number} userId - 사용자 ID
 * @param {number} fileId - 파일 ID
 */
async function deleteFileById(userId, fileId) {
    const file = await File.findOne({ where: { id: fileId, user_id: userId } });

    if (!file) {
        const error = new Error("파일을 찾을 수 없거나 삭제할 권한이 없습니다.");
        error.status = 404;
        throw error;
    }

    const filePath = path.join(__dirname, "../..", file.path);
    fs.unlink(filePath, (err) => {
        if (err) {
            // 파일을 삭제하는 동안 오류가 발생해도 데이터베이스에서는 삭제를 시도
            console.error(`파일 삭제 실패: ${filePath}`, err);
        }
    });

    await file.destroy();
}

module.exports = { saveFileMetadata, getFilesByUserId, deleteFileById };
