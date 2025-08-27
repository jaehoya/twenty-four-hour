/**
 * multer 설정 파일
 * - 업로드 경로: src/uploads/
 * - 파일명: 타임스탬프+랜덤값+원래 확장자
 * - 파일 타입 제한: 이미지(JPEG/PNG), PDF, Word(DOC/DOCX)
 * - 파일 크기 제한: 10MB
 */

const multer = require("multer");
const path = require("path");

// 저장소 설정 (디스크에 저장)
const storage = multer.diskStorage({
    // 업로드 폴더 지정
    destination: (req, file, cb) => {
        cb(null, "src/uploads/");
    },

    // 저장 파일명 지정 
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname).toLowerCase();  // 확장자 추출
        cb(null, uniqueSuffix + ext);
    },
});

// 허용할 확장자 목록
const allowedMime = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
];

// 파일 타입 필터
const fileFilter = (req, file, cb) => {
    if(allowedMime.includes(file.mimetype)) {
        cb(null, true);  // 허용된 확장자면 통과
    }
    else {
        cb(new Error("허용되지 않은 파일 형식입니다."), false);  // 업로드 거부
    }
};

// 업로드 미들웨어 인스턴스 
const upload = multer({
    storage,     // 저장소 설정
    fileFilter,  // 파일 타입 필터
    limits: { fileSize: 10 * 1024 * 1024 },  // 파일 크기 제한
});

module.exports = upload;