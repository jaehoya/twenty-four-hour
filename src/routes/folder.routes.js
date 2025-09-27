const express = require("express");
const router = express.Router();
const { 
    createFolderController,
    getSubFoldersController,
    getFilesInFolderController, 
} = require("../controllers/folder.controller");
const authenticateToken = require("../middlewares/auth");

// POST /api/folders -> 새 폴더 생성
router.post("/", authenticateToken, createFolderController);

// GET /api/folders/:id/subfolders -> 하위 폴더 조회
router.get("/:id/subfolders", authenticateToken, getSubFoldersController);

// GET /api/folders/:id/files -> 파일 조회
router.get("/:id/files", authenticateToken, getFilesInFolderController);

module.exports = router;