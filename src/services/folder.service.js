const { Folder } = require("../models");
const fs = require("fs");
const path = require("path");

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

    return path.join("src/uploads", ...segments);
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

    // parentId 기준으로 경로 계산
    const relativePath = await buildFolderPath(folder);
    const absolutePath = path.join(__dirname, "../..", relativePath);

    // 실제 디렉토리 생성 (있으면 패스)
    if (!fs.existsSync(absolutePath)) {
        fs.mkdirSync(absolutePath, { recursive: true });
    }

    return folder;
}


module.exports = { createFolder };