const { 
    createFolder,
    getSubFolders,
    getFilesInFolder,
    renameFolder,
    deleteFolder
} = require("../services/folder.service");

// 폴더 생성 컨트롤러
async function createFolderController(req, res, next) {
    try {
        const userId = req.user.id;
        const { name, parentId } = req.body;

        // 폴더 이름이 없는 경우
        if (!name) {
            return res.status(400).json({
                state: 400,
                code: "NO_FOLDER_NAME",
                message: "폴더 이름은 필수입니다.",
            });
        }

        // 서비스 호출 
        const folder = await createFolder(userId, name, parentId);

        return res.status(201).json({
            state: 201,
            code: "FOLDER_CREATED",
            message: "폴더 생성 성공",
            folder: folder,
        });
    } catch (err) {
        next(err);
    }
}

// 하위 폴더 조회 컨트롤러
async function getSubFoldersController(req, res, next) {
    try { 
        const userId = req.user.id;
        const folderId = req.params.id === "root" ? null : parseInt(req.params.id, 10);

        const folders = await getSubFolders(userId, folderId);

        return res.status(200).json({
            state: 200,
            code: "SUBFOLDERS_FOUND",
            message: "하위 폴더 조회 성공",
            folders,
        });
    } catch (err) {
        next(err);
    }
}

// 파일 조회 컨트롤러
async function getFilesInFolderController(req, res, next) {
    try {
        const userId = req.user.id;
        const folderId = req.params.id === "root" ? null : parseInt(req.params.id, 10);

        const files = await getFilesInFolder(userId, folderId);

        return res.status(200).json({
            state: 200,
            code: "FILES_FOUND",
            message: "폴더 내 파일 조회 성공",
            files,
        });
    } catch (err) {
        next(err);
    }
}


// 폴더 이름 변경 컨트롤러
async function renameFolderController(req, res, next) {
    try {
        const userId = req.user.id;
        const folderId = parseInt(req.params.id, 10);
        const { name: newName } = req.body;

        if (!newName) {
            return res.status(400).json({
                state: 400,
                code: "NO_NEW_FOLDER_NAME",
                message: "새 폴더 이름은 필수입니다.",
            });
        }

        const updatedFolder = await renameFolder(userId, folderId, newName);

        return res.status(200).json({
            state: 200,
            code: "FOLDER_RENAMED",
            message: "폴더 이름 변경 성공",
            folder: updatedFolder,
        });
    } catch (err) {
        next(err);
    }
}


// 폴더 삭제 컨트롤러
async function deleteFolderController(req, res, next) {
    try {
        const userId = req.user.id;
        const folderId = parseInt(req.params.id, 10);

        await deleteFolder(userId, folderId);

        return res.status(200).json({
            state: 200,
            code: "FOLDER_DELETED",
            message: "폴더 삭제 성공",
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { 
    createFolderController,
    getSubFoldersController,
    getFilesInFolderController,
    renameFolderController,
    deleteFolderController
};