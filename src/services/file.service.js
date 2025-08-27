/**
 * 파일 메타데이터 DB 저장 서비스
 * - File 모델을 통해 files 테이블에 레코드 생성
 * - path는 로컬 저장 경로를 그대로 기록
 */

const { File } = require("../models");

/**
 * 파일 메타데이터 저장
 * -userId: 업로드한 사용자 ID (req.user.id에서 주입됨)
 * -file: multer가 제공하는 파일 객체
 */
async function saveFileMetadata(userId, file) {
    return await File.create({
        user_id: userId,
        original_name: file.originalname,
        stored_name: file.filename,
        mime_type: file.mimetype,
        size: file.size,
        path: "src/uploads/" + file.filename,
    });
}

module.exports = { saveFileMetadata };