const jwt = require("jsonwebtoken");
const path = require("path");
const OpenAI = require("openai");
const fs = require("fs");

const {
    saveFileMetadata, 
    getFilesByUserId, 
    deleteFileById,
    getFileById, 
    renameFileById,
    updateFilePath,
} = require("../services/file.service");

require("dotenv").config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 파일을 AI가 이해할 수 있는 텍스트로 변환
async function extractText(filePath, mimeType) {
    const buffer = fs.readFileSync(filePath);
    const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            {
                role: "user",
                content: [
                    {
                        type: "input_text",
                        input_text: {
                            mime_type: mimeType,
                            data: buffer,
                        },
                    },
                ],
            },
        ],
    });

    return res.choices[0].message.content;
}

// AI에게 태그 및 폴더명 생성 요청
async function generateFolderName(text, filename) {
    const prompt = `
다음 파일 내용을 분석하고 적절한 폴더명을 하나 추천하세요.
응답은 { "folder": "폴더명" } 형태의 JSON으로 주세요.

파일명: ${filename}
내용:
${text}
`;

    const res = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
    });

    return res.choices[0].message.parsed;
}

// uploads/ 폴더로 파일 이동
function moveFile(tempPath, folderName, originalName) {
    const BASE_DIR = "uploads";   

    // 폴더 경로: uploads/{AI가 제안한 폴더명}
    const targetDir = path.join(BASE_DIR, folderName);

    // 폴더가 없으면 생성 (재귀 포함)
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    const storedName = Date.now() + "_" + originalName;
    const finalPath = path.join(targetDir, storedName);

    // upload/xxxx → upload/{folderName}/{timestamp_originalName}
    fs.renameSync(tempPath, finalPath);

    return {
        storedName,   // 파일명
        finalPath,    // 전체 경로
    };
}


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
        const mimeType = req.file.mimetype;
        const moved = moveFile(tempPath, "temp", req.file.originalname);

        const fileRecord = await saveFileMetadata(userId, {
            originalname: req.file.originalname,
            filename: moved.storedName,
            mimetype: mimeType,
            size: req.file.size,
            path: moved.finalPath,
        });

        // AI 태깅 작업을 큐에 넣기
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