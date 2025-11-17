const { File, Favorite, FileTag } = require("../models");
const { Op } = require("sequelize");

/**
 * 파일 메타데이터 저장
 * -userId: 업로드한 사용자 ID (req.user.id에서 주입됨)
 * -file: multer가 제공하는 파일 객체
 */
async function saveFileMetadata(userId, file) {
    const fileRecord = await File.create({
        user_id: userId,
        original_name: file.originalname,
        stored_name: file.filename,
        mime_type: file.mimetype,
        size: file.size,
        path: file.path,
    });

    const previewUrl = `/api/files/${fileRecord.id}/preview`;

    return {
        ...fileRecord.toJSON(),
        previewUrl,
    };
}

// 사용자 파일 목록 조회 
async function getFilesByUserId(userId, search, sortBy, sortOrder) {
    const where = { user_id: userId };
    if (search) {
        where.original_name = { [Op.like]: `%${search}%` };
    }

    const order = [];
    if (sortBy) {
        order.push([sortBy, sortOrder || "ASC"]);
    } else {
        order.push(["createdAt", "DESC"]);
    }

    const files = await File.findAll({
        where,
        order,
        include: [
            {
                model: Favorite,
                required: false,
                where: { userId, targetType: "file" },
                attributes: ["id"],
            },
            {
                model: FileTag,
                as: "tags",
                required: false,
                attributes: ["tag"],
            }
        ],
    });

    return files.map(f => ({
    id: f.id,
    name: f.original_name,
    size: f.size,
    mimeType: f.mime_type,
    createdAt: f.createdAt,
    isFavorite: f.Favorites.length > 0,
    tags: f.tags.map(t => t.tag),
    previewUrl: `/api/files/${f.id}/preview`,
  }));
}

// 파일 ID로 파일 조회 (다운로드용)
async function getFileById(fileId) {
    return await File.findByPk(fileId);
}

/**
 * 파일 ID와 사용자 ID로 파일 삭제 (소프트 삭제)
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

    // paranoid: true 옵션으로 인해 soft delete가 실행됨
    await file.destroy();
}

/**
 * 파일 이름 변경
 * @param {number} userId - 사용자 ID
 * @param {number} fileId - 파일 ID
 * @param {string} newName - 새 파일 이름
 */
async function renameFileById(userId, fileId, newName) {
    const file = await File.findOne({ where: { id: fileId, user_id: userId } });

    if (!file) {
        const error = new Error("파일을 찾을 수 없거나 수정할 권한이 없습니다.");
        error.status = 404;
        throw error;
    }

    file.original_name = newName;
    await file.save();

    return {
        ...file.toJSON(),
        previewUrl: `/api/files/${file.id}/preview`,
    }
}

module.exports = { 
    saveFileMetadata, 
    getFilesByUserId, 
    getFileById, 
    deleteFileById, 
    renameFileById
};

