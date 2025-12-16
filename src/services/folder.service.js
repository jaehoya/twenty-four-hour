const { Folder, File, Favorite, FileTag } = require("../models");
const fs = require("fs").promises;
const path = require("path");

// src/uploads 기준 경로 고정
const UPLOADS_BASE = path.resolve(__dirname, "../uploads");

/**
 * 경로 탈출 방지용 안전한 경로 생성
 */
function safeResolve(...segments) {
    const targetPath = path.resolve(UPLOADS_BASE, ...segments);
    if (!targetPath.startsWith(UPLOADS_BASE)) {
        throw new Error("Invalid folder path");
    }
    return targetPath;
}


/**
 * parentId를 따라 최상위까지 올라가며 경로를 생성
 */
async function buildFolderPath(folder) {
    let segments = [folder.name];  // 현재 폴더 이름을 경로 배열에 추가
    let currentParentId = folder.parentId;

    // 최상위까지 올라감
    while (currentParentId) {
        const parent = await Folder.findByPk(currentParentId);
        if (!parent) break;
        segments.unshift(parent.name);  // 부모 이름을 앞쪽에 추가
        currentParentId = parent.parentId;  // 상위 부모로 이동
    }

    return safeResolve(...segments);  // 항상 src/uploads 밑으로 제한
}

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

    // 안전한 절대 경로 계산
    const absolutePath = await buildFolderPath(folder);

    // 실제 디렉토리 생성 (있으면 패스)
    try {
        await fs.mkdir(absolutePath, { recursive: true });
    } catch (err) {
        if (err.code !== "EEXIST") throw err;
    }

    return folder;
}

// 하위 폴더 조회
async function getSubFolders(userId, parentId = null) {
    const folders = await Folder.findAll({
        where: { userId, parentId },
        order: [["createdAt", "ASC"]],
        include: [
            {
                model: Favorite,
                required: false,
                where: { userId, targetType: "folder" },
                attributes: ["id"],
            },
        ],
    });

    return folders.map(f => ({
        id: f.id,
        name: f.name,
        createdAt: f.createdAt,
        isFavorite: f.Favorites.length > 0,
    }));
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
        isFavorite: f.Favorites.length > 0,
        tags: f.tags ? f.tags.map(t => t.tag) : []
    }));
}



// 폴더 이름 변경
async function renameFolder(userId, folderId, newName) {
    const folder = await Folder.findOne({ where: { id: folderId, userId } });

    if (!folder) {
        throw new Error("Folder not found or user not authorized");
    }

    const oldPath = await buildFolderPath(folder);
    const originalName = folder.name;
    folder.name = newName;
    const newPath = await buildFolderPath(folder);

    // 실제 디렉토리 이름 변경
    try {
        await fs.rename(oldPath, newPath);
    } catch (err) {
        // 이름 변경 실패 시 DB 롤백
        folder.name = originalName;
        await folder.save();
        throw err;
    }

    await folder.save();
    return folder;
}


// 폴더 및 하위 폴더/파일 삭제
async function deleteFolder(userId, folderId) {
    const folder = await Folder.findOne({ where: { id: folderId, userId } });

    if (!folder) {
        throw new Error("Folder not found or user not authorized");
    }

    const folderPath = await buildFolderPath(folder);

    // DB에서 모든 하위 폴더 및 파일 삭제
    await deleteSubFoldersAndFiles(userId, folderId);

    // 실제 디렉토리 삭제
    await fs.rm(folderPath, { recursive: true, force: true });

    // 최상위 폴더 삭제
    await folder.destroy();
}

// 재귀적으로 하위 폴더와 파일을 삭제하는 함수
async function deleteSubFoldersAndFiles(userId, parentId) {
    const subFolders = await Folder.findAll({ where: { userId, parentId } });
    for (const subFolder of subFolders) {
        await deleteSubFoldersAndFiles(userId, subFolder.id); // 재귀 호출
        await subFolder.destroy();
    }

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
    buildFolderPath,
    getAllFoldersFlat
};
