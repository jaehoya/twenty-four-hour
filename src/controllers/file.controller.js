const jwt = require("jsonwebtoken");
const path = require("path");

const {
    saveFileMetadata, 
    getFilesByUserId, 
    deleteFileById,
    getFileById, 
    renameFileById,
} = require("../services/file.service");
const { addAiTagJob } = require("../queue/tag.queue");

// 파일 업로드 처리 컨트롤러 + AI 자동 분류
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

        // AI 태깅 작업을 큐에 추가 (백그라운드 처리)
        await addAiTagJob(fileRecord.id);

        return res.status(201).json({
            state: 201,
            code: "UPLOAD_SUCCESS",
            message: "파일 업로드 성공. AI 태깅은 백그라운드에서 실행됩니다.",
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

// 파일 다운로드 컨트롤러
async function downloadFile(req, res, next) {
    try {
        const fileId = req.params.id;
        const file = await getFileById(fileId);

        if(!file) {
            return res.status(404).json({
                state: 404,
                code: "FILE_NOT_FOUND",
                message: "파일을 찾을 수 없습니다.",
            });
        }

        // 파일 경로에서 실제 파일을 찾아서 원래 파일명으로 다운로드
        return res.download(file.path, file.original_name);
    } catch(err) {
        next(err);
    }
}

// 파일 이름 변경 컨트롤러
async function renameFile(req, res, next) {
    try {
        const userId = req.user.id;
        const fileId = req.params.id;
        const { newName } = req.body;

        if (!newName) {
            return res.status(400).json({
                state: 400,
                code: "NO_NEW_NAME",
                message: "새 파일 이름을 입력해주세요.",
            });
        }

        const updatedFile = await renameFileById(userId, fileId, newName);

        return res.status(200).json({
            state: 200,
            code: "FILE_RENAMED",
            message: "파일 이름이 성공적으로 변경되었습니다.",
            file: updatedFile,
        });
    } catch (err) {
        next(err);
    }
}

// 파일 미리보기 컨트롤러
async function previewFile(req, res, next) {
    try {
        const token = req.query.token;

        if (!token) {
            return res.status(401).json({
                state: 401, 
                code: "NO_TOKEN",
                message: "토큰이 필요합니다."
            })
        }

        // 토큰 검증
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        } catch (err) {
            return res.status(401).json({
                state: 401,
                code: "INVALID_TOKEN",
                message: "유효하지 않은 토큰입니다.",
            });
        }

        // 파일 조회
        const fileId = req.params.id;
        const file = await getFileById(fileId);

        if (!file) {
            return res.status(404).json({
                state: 404, 
                code: "FILE_NOT_FOUND",
                message: "파일을 찾을 수 없습니다.",
            });
        }

        // 미리보기 가능한 타입인지 확인
        const allowedTypes = ["image/", "application/pdf", "text/plain"];
        const isPreviewable = allowedTypes.some(type => file.mime_type.startsWith(type));

        if (!isPreviewable) {
            return res.status(400).json({
                state: 400,
                code: "UNSUPPORTED_TYPE",
                message: "이 파일 형식은 미리보기를 지원하지 않습니다.",
            });
        }

        // 파일 스트림 전송
        const absolutePath = path.resolve(file.path); 
        res.setHeader("Content-Type", file.mime_type);
        return res.sendFile(absolutePath);
    } catch (err) {
        next(err);
    }
}

module.exports = { uploadFile, getUserFiles, deleteFile, downloadFile, renameFile, previewFile };