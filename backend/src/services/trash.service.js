const { File, Folder } = require("../models");
const fs = require("fs");
const path = require("path");
const { Op } = require("sequelize");

/**
 * 휴지통에 있는 파일/폴더 목록 조회
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

    const folders = await Folder.findAll({
        where: {
            userId: userId,
            deletedAt: { [Op.ne]: null }
        },
        paranoid: false,
    });

    return { files, folders };
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

    // 파일 시스템 이동 로직 제거 (Soft Delete이므로 DB 상태만 변경)
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
    if (file.path && fs.existsSync(file.path)) {
        try {
            fs.unlinkSync(file.path);
        } catch (err) {
            console.error(`Failed to delete file at ${file.path}:`, err);
        }
    }

    // 데이터베이스에서 영구 삭제
    await file.destroy({ force: true });
}

/**
 * 재귀적으로 폴더와 그 내부 항목들을 복원
 */
async function restoreFolderRecursive(userId, folderId) {
    // 1. 폴더 찾기 (삭제된 것 포함)
    const folder = await Folder.findOne({
        where: { id: folderId, userId },
        paranoid: false
    });

    if (!folder) return;

    // 2. 상위 폴더 확인 로직
    if (folder.parentId) {
        const parent = await Folder.findByPk(folder.parentId);
        // 부모 폴더가 없거나(DB에서 완전히 삭제됨), 삭제된 상태(soft deleted)라면
        // 현재 폴더를 최상위(Root)로 이동
        if (!parent || parent.deletedAt) {
            folder.parentId = null;
        }
    }

    // 3. 폴더 자체 복원
    await folder.restore();

    // 4. 하위 폴더들 찾아서 재귀 복원
    // (삭제 시점과 무관하게 해당 폴더에 속해있던 '삭제된' 폴더들을 모두 복구하는 단순 정책 사용)
    const subFolders = await Folder.findAll({
        where: { userId, parentId: folderId, deletedAt: { [Op.ne]: null } },
        paranoid: false
    });

    for (const sub of subFolders) {
        // 하위 폴더 재귀 호출 시에는 parentId 체크 불필요 (이미 부모가 복원되었으므로)
        await restoreSubFolderRecursive(userId, sub.id);
    }

    // 5. 하위 파일들 복원
    await File.restore({
        where: {
            user_id: userId,
            folderId: folderId,
            deletedAt: { [Op.ne]: null }
        }
    });
}

// 내부 재귀용 (부모 체크 제외)
async function restoreSubFolderRecursive(userId, folderId) {
    const folder = await Folder.findOne({
        where: { id: folderId, userId },
        paranoid: false
    });
    if (!folder) return;

    await folder.restore();

    const subFolders = await Folder.findAll({
        where: { userId, parentId: folderId, deletedAt: { [Op.ne]: null } },
        paranoid: false
    });

    for (const sub of subFolders) {
        await restoreSubFolderRecursive(userId, sub.id);
    }

    await File.restore({
        where: { user_id: userId, folderId: folderId, deletedAt: { [Op.ne]: null } }
    });
}


/**
 * 휴지통에서 폴더 복원 (진입점)
 * @param {number} userId
 * @param {number} folderId
 */
async function restoreFolder(userId, folderId) {
    await restoreFolderRecursive(userId, folderId);
}

/**
 * 재귀적으로 폴더와 파일을 영구 삭제
 */
async function deleteFolderRecursive(userId, folderId) {
    // 1. 하위 파일 영구 삭제 (파일 시스템 + DB)
    const files = await File.findAll({
        where: { user_id: userId, folderId },
        paranoid: false
    });

    for (const file of files) {
        // 실제 파일 삭제
        if (file.path && fs.existsSync(file.path)) {
            try {
                fs.unlinkSync(file.path);
            } catch (err) {
                console.error(`Failed to delete file at ${file.path}:`, err);
            }
        }
        await file.destroy({ force: true });
    }

    // 2. 하위 폴더 재귀 삭제
    const subFolders = await Folder.findAll({
        where: { userId, parentId: folderId },
        paranoid: false
    });

    for (const sub of subFolders) {
        await deleteFolderRecursive(userId, sub.id);
    }

    // 3. 현재 폴더 영구 삭제
    const folder = await Folder.findOne({
        where: { id: folderId, userId },
        paranoid: false
    });

    if (folder) {
        await folder.destroy({ force: true });
    }
}

/**
 * 폴더 영구 삭제 (진입점)
 * @param {number} userId
 * @param {number} folderId
 */
async function permanentlyDeleteFolder(userId, folderId) {
    // 존재 여부 확인
    const folder = await Folder.findOne({
        where: { id: folderId, userId },
        paranoid: false
    });

    if (!folder) {
        const error = new Error("폴더를 찾을 수 없거나 삭제할 권한이 없습니다.");
        error.status = 404;
        throw error;
    }

    await deleteFolderRecursive(userId, folderId);
}

module.exports = {
    getTrashedFiles,
    restoreFile,
    restoreFolder,
    permanentlyDeleteFile,
    permanentlyDeleteFolder,
};
