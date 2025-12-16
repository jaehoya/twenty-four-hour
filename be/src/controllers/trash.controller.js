const trashService = require("../services/trash.service");

// 휴지통 파일 목록 조회
async function listTrashedFiles(req, res, next) {
    try {
        const userId = req.user.id;
        const files = await trashService.getTrashedFiles(userId);
        res.status(200).json({
            message: "휴지통 파일 목록 조회 성공",
            files,
        });
    } catch (err) {
        next(err);
    }
}

// 휴지통에서 파일 복원
async function restoreTrashedFile(req, res, next) {
    try {
        const userId = req.user.id;
        const fileId = req.params.id;
        await trashService.restoreFile(userId, fileId);
        res.status(200).json({ message: "파일이 성공적으로 복원되었습니다." });
    } catch (err) {
        next(err);
    }
}

// 파일 영구 삭제
async function deletePermanently(req, res, next) {
    try {
        const userId = req.user.id;
        const fileId = req.params.id;
        await trashService.permanentlyDeleteFile(userId, fileId);
        res.status(200).json({ message: "파일이 영구적으로 삭제되었습니다." });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    listTrashedFiles,
    restoreTrashedFile,
    deletePermanently,
};
