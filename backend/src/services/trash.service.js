const { File, Folder } = require("../models");
const path = require("path");
const { Op } = require("sequelize");
const fs = require("fs").promises;
const fss = require("fs"); // existsSync 용
const {
  getFolderPhysicalPath,
  getUserTrashDir,
  getUserActiveDir,
  ensureDir,
} = require("../utils/uploadPath");

/**
 * 휴지통에 있는 파일/폴더 목록 조회
 */
async function getTrashedFiles(userId) {
  const deletedFolders = await Folder.findAll({
    where: {
      userId,
      deletedAt: { [Op.ne]: null },
    },
    attributes: ["id", "name", "deletedAt"],
    paranoid: false,
  });

  const deletedFolderIds = deletedFolders.map((f) => f.id);

  const files = await File.findAll({
    where: {
      user_id: userId,
      deletedAt: { [Op.ne]: null },
      [Op.or]: [
        { folderId: null },
        { folderId: { [Op.notIn]: deletedFolderIds } },
      ],
    },
    paranoid: false,
  });

  return { folders: deletedFolders, files };
}

/**
 * 휴지통 폴더 내부 조회
 */
async function getTrashedFolderContents(userId, folderId) {
  const folder = await Folder.findOne({
    where: { id: folderId, userId },
    paranoid: false,
  });

  if (!folder || !folder.deletedAt) {
    const err = new Error("삭제된 폴더가 아닙니다.");
    err.status = 400;
    throw err;
  }

  const folders = await Folder.findAll({
    where: {
      userId,
      parentId: folderId,
      deletedAt: { [Op.ne]: null },
    },
    paranoid: false,
  });

  const files = await File.findAll({
    where: {
      user_id: userId,
      folderId,
      deletedAt: { [Op.ne]: null },
    },
    paranoid: false,
  });

  return { folders, files };
}

/**
 * 휴지통에서 파일 복원
 */
async function restoreFile(userId, fileId) {
  const file = await File.findOne({
    where: { id: fileId, user_id: userId },
    paranoid: false,
  });

  if (!file) {
    const err = new Error("파일을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  const trashPath = path.join(
    getUserTrashDir(userId),
    path.basename(file.path)
  );
  const activeDir = getUserActiveDir(userId);
  const restorePath = path.join(activeDir, path.basename(file.path));

  if (fss.existsSync(trashPath)) {
    await ensureDir(activeDir);
    await fs.rename(trashPath, restorePath);
    file.path = restorePath;
  }

  await file.restore();
  await file.save();
}

/**
 * 파일 영구 삭제
 */
async function permanentlyDeleteFile(userId, fileId) {
  const file = await File.findOne({
    where: { id: fileId, user_id: userId },
    paranoid: false,
  });

  if (!file) {
    const err = new Error("파일을 찾을 수 없습니다.");
    err.status = 404;
    throw err;
  }

  const trashDir = getUserTrashDir(userId);
  const filename = path.basename(file.path);
  const realPath = path.join(trashDir, filename);

  if (fss.existsSync(realPath)) {
    await fs.unlink(realPath);
  }

  await file.destroy({ force: true });
}

/**
 * 폴더 재귀 복원
 */
async function restoreFolderRecursive(userId, folderId) {
  const folder = await Folder.findOne({
    where: { id: folderId, userId },
    paranoid: false,
  });
  if (!folder) return;

  if (folder.parentId) {
    const parent = await Folder.findByPk(folder.parentId);
    if (!parent || parent.deletedAt) {
      folder.parentId = null;
    }
  }

  await folder.restore();

  const subFolders = await Folder.findAll({
    where: { userId, parentId: folderId, deletedAt: { [Op.ne]: null } },
    paranoid: false,
  });

  for (const sub of subFolders) {
    await restoreFolderRecursive(userId, sub.id);
  }

  await File.restore({
    where: {
      user_id: userId,
      folderId,
      deletedAt: { [Op.ne]: null },
    },
  });
}

/**
 * 휴지통 폴더 복원 (진입점)
 */
async function restoreFolder(userId, folderId) {
  const from = getFolderPhysicalPath(userId, folderId, "trash");
  const to = getFolderPhysicalPath(userId, folderId, "active");

  await ensureDir(path.dirname(to));
  await fs.rename(from, to);

  await restoreFolderRecursive(userId, folderId);
}

/**
 * 폴더 재귀 영구 삭제 (파일 실제 삭제 포함)
 */
async function deleteFolderRecursive(userId, folderId) {
  const files = await File.findAll({
    where: { user_id: userId, folderId },
    paranoid: false,
  });

  for (const file of files) {
    if (file.path && fss.existsSync(file.path)) {
      await fs.unlink(file.path);
    }
    await file.destroy({ force: true });
  }

  const subFolders = await Folder.findAll({
    where: { userId, parentId: folderId },
    paranoid: false,
  });

  for (const sub of subFolders) {
    await deleteFolderRecursive(userId, sub.id);
  }

  const folder = await Folder.findOne({
    where: { id: folderId, userId },
    paranoid: false,
  });

  if (folder) {
    await folder.destroy({ force: true });
  }
}

/**
 * 폴더 영구 삭제 (진입점)
 */
async function permanentlyDeleteFolder(userId, folderId) {
  const folderPath = getFolderPhysicalPath(userId, folderId, "trash");

  await deleteFolderRecursive(userId, folderId);

  if (fss.existsSync(folderPath)) {
    await fs.rm(folderPath, { recursive: true, force: true });
  }
}

module.exports = {
  getTrashedFiles,
  getTrashedFolderContents,
  restoreFile,
  restoreFolder,
  permanentlyDeleteFile,
  permanentlyDeleteFolder,
};
