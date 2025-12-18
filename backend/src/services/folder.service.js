const { Folder, File, Favorite, FileTag } = require("../models");
const {
    getFolderPhysicalPath,
    ensureDir
} = require("../utils/uploadPath");
const path = require("path");
const fs = require("fs");

/**
 * 폴더 생성
 */
async function createFolder(userId, name, parentId = null) {
    // DB에 폴더 메타데이터 저장
    const folder = await Folder.create({
        userId,
        parentId,
        name,
    });

    const folderPath = getFolderPhysicalPath(userId, folder.id);

    // 실제 디렉토리 생성 (있으면 패스)
    try {
        await ensureDir(folderPath);
    } catch (err) {
        if (err.code !== "EEXIST") throw err;
    }

    return folder;
}

// 하위 폴더 조회
async function getSubFolders(userId, parentId = null) {
    try {
        console.log("🔍 디버깅 - 조회 시도중:", { userId, parentId });
        
        // 실제 실행되는 부분
        const folders = await Folder.findAll({
            where: { userId, parentId },
            include: [{ model: Favorite, required: false }] 
        });

        return folders.map(f => ({
            ...f.toJSON(),
            isFavorite: (f.Favorites || []).length > 0
        }));

    } catch (error) {
        // 🚨 여기가 핵심입니다! 터미널에 에러 원인을 강제로 출력합니다.
        console.error("❌ getSubFolders에서 발생한 진짜 에러:", error);
        throw error; // 다시 던져줘야 500 응답이 나갑니다.
    }
}

// 특정 폴더 안 파일 조회
async function getFilesInFolder(userId, folderId = null) {
    const files = await File.findAll({
        where: { user_id: userId, folderId },
        order: [["createdAt", "DESC"]],
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
    // 여기도 안전하게 수정
    isFavorite: (f.Favorites && f.Favorites.length > 0) || (f.favorites && f.favorites.length > 0) || false,
    tags: f.tags ? f.tags.map(t => t.tag) : []
}));
}



// 폴더 이름 변경
async function renameFolder(userId, folderId, newName) {
    const folder = await Folder.findOne({ where: { id: folderId, userId } });

    if (!folder) {
        throw new Error("Folder not found or user not authorized");
    }

    folder.name = newName;
    await folder.save();

    return folder;
}


// 폴더 및 하위 폴더/파일 삭제 (Soft Delete)
async function deleteFolder(userId, folderId) {
    const folder = await Folder.findOne({ where: { id: folderId, userId } });

    if (!folder) {
        throw new Error("Folder not found or user not authorized");
    }

    // 1. 물리 폴더 이동 (active → trash)
    const from = getFolderPhysicalPath(userId, folderId, "active");
    const to = getFolderPhysicalPath(userId, folderId, "trash");

    await ensureDir(path.dirname(to));
    await fs.renameSync(from, to);

    // 2. DB soft delete (폴더 + 하위)
    await deleteSubFoldersAndFiles(userId, folderId);
    await folder.destroy(); // deletedAt 세팅
}

// 재귀적으로 하위 폴더와 파일을 soft delete 하는 함수
async function deleteSubFoldersAndFiles(userId, parentId) {
    const subFolders = await Folder.findAll({ where: { userId, parentId } });
    for (const subFolder of subFolders) {
        await deleteSubFoldersAndFiles(userId, subFolder.id); // 재귀 호출
        await subFolder.destroy();
    }

    // 해당 폴더의 파일들 soft delete
    await File.destroy({ where: { user_id: userId, folderId: parentId } });
}

// AI 분석용으로 모든 폴더를 플랫하게 조회 (이름, ID만)
async function getAllFoldersFlat(userId) {
    return Folder.findAll({
        where: { userId },
        attributes: ['id', 'name']
    });
}

module.exports = {
    createFolder,
    getSubFolders,
    getFilesInFolder,
    renameFolder,
    deleteFolder,
    getAllFoldersFlat
};
