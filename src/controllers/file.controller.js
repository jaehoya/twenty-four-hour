/**
 * 파일 업로드 컨트롤러
 * - multer에서 req.file 주입
 * - 파일 없으면 400 반환
 * - 성공 시 201 + 저장된 파일 메타데이터 반환
 */

const { saveFileMetadata } = require("../services/file.service");

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

        // JWT 인증 붙인 후에 req.user.id 사용
        // 지금은 테스트용 임시값 처리
        const userId = (req.user && req.user.id) || 1;
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

module.exports = { uploadFile };