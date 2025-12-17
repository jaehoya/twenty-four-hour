const trashService = require("../services/trash.service");

// 휴지통 파일 목록 조회
async function listTrashedFiles(req, res, next) {
    try {
        const userId = req.user.id;
        const { files, folders } = await trashService.getTrashedFiles(userId);
        res.status(200).json({
            message: "휴지통 목록 조회 성공",
            files,
            folders,
        });
    } catch (err) {
        next(err);
    }
}

// 휴지통에서 파일/폴더 복원
async function restoreTrashedFile(req, res, next) {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const type = req.query.type || 'file'; // 'file' or 'folder'

        if (type === 'folder') {
            await trashService.restoreFolder(userId, id);
            res.status(200).json({ message: "폴더가 성공적으로 복원되었습니다." });
        } else {
            await trashService.restoreFile(userId, id);
            res.status(200).json({ message: "파일이 성공적으로 복원되었습니다." });
        }
    } catch (err) {
        next(err);
    }
}

// 파일/폴더 영구 삭제
async function deletePermanently(req, res, next) {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const type = req.query.type || 'file'; // 'file' or 'folder'

        if (type === 'folder') {
            await trashService.permanentlyDeleteFolder(userId, id);
            res.status(200).json({ message: "폴더가 영구적으로 삭제되었습니다." });
        } else {
            await trashService.permanentlyDeleteFile(userId, id);
            res.status(200).json({ message: "파일이 영구적으로 삭제되었습니다." });
        }
    } catch (err) {
        next(err);
    }
}

module.exports = {
    listTrashedFiles,
    restoreTrashedFile,
    deletePermanently,
};
