const path = require("path");
const fs = require("fs").promises;

const UPLOADS_ROOT = path.join(
    process.cwd(),
    "src",
    "uploads"
);

function getUserBaseDir(userId) {
    return path.join(UPLOADS_ROOT, `user_${userId}`);
}

function getUserActiveDir(userId) {
    return path.join(getUserBaseDir(userId), "active");
}

function getUserTrashDir(userId) {
    return path.join(getUserBaseDir(userId), "trash");
}

function getFolderPhysicalPath(userId, folderId, location = "active") {
    return path.join(
        location === "trash"
            ? getUserTrashDir(userId)
            : getUserActiveDir(userId),
        `folder_${folderId}`
    );
}

/**
 * 디렉토리 보장 (없으면 생성)
 */
async function ensureDir(dirPath) {
    await fs.mkdir(dirPath, { recursive: true });
}

module.exports = {
    UPLOADS_ROOT,
    getUserBaseDir,
    getUserActiveDir,
    getUserTrashDir,
    getFolderPhysicalPath,
    ensureDir,
};
