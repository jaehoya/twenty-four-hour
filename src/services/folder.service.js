const { Folder, File } = require("../models");
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
    while(currentParentId) {
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
        if (err.code !== "EEXIST")  throw err;
    }

    return folder;
}

// 하위 폴더 조회
async function getSubFolders(userId, parentId = null) {
    return await Folder.findAll({
        where: { userId, parentId },
        order: [["createdAt", "ASC"]],
    });
}

// 특정 폴더 안 파일 조회
async function getFilesInFolder(userId, folderId = null) {
    return await File.findAll({
        where: { user_id: userId, folderId },
        order: [["createdAt", "ASC"]],
    });
}

module.exports = { 
    createFolder,
    getSubFolders,
    getFilesInFolder
};
