/**
 * 파일 업로드 컨트롤러
 * - multer에서 req.file 주입
 * - 파일 없으면 400 반환
 * - 성공 시 201 + 저장된 파일 메타데이터 반환
 */

const { saveFileMetadata, getFilesByUserId, deleteFileById } = require("../services/file.service");

// 파일 업로드 처리 컨트롤러
async function uploadFile(req, res, next) {
    try {
        // 업로드 된 파일이 없는 경우
        if(!req.file){
            return res.status(400).json({
                state: 400, 
                code: "NO_FILE",
                message: "업로드할 파일을 선택해주세요.",
            });
        }

        const userId = req.user.id;
        const fileRecord = await saveFileMetadata(userId, req.file);

        return res.status(201).json({
            state: 201,
            code: "UPLOAD_SUCCESS",
            message: "파일 업로드 성공",
            file: fileRecord,
        });
    } catch (err) {
        // multer의 파일 타입/사이즈 에러도 여기로 들어옴
        // 표준 에러 핸들러로 위임
        next(err);
    }
}


// 사용자 파일 목록 조회 컨트롤러
async function getUserFiles(req, res, next) {
    try {
        const userId = req.user.id;
        const { search, sortBy, sortOrder } = req.query;
        const files = await getFilesByUserId(userId, search, sortBy, sortOrder);

        return res.status(200).json({
            state: 200,
            code: "FILES_FOUND",
            message: "사용자 파일 목록 조회 성공",
            files: files,
        });
    } catch (err) {
        next(err);
    }
}

// 파일 삭제 컨트롤러
async function deleteFile(req, res, next) {
    try {
        const userId = req.user.id;
        const fileId = req.params.id;

        await deleteFileById(userId, fileId);

        return res.status(200).json({
            state: 200,
            code: "FILE_DELETED",
            message: "파일 삭제 성공",
        });
    } catch (err) {
        next(err);
    }
}

module.exports = { uploadFile, getUserFiles, deleteFile };