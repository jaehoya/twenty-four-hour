const shareService = require("../services/share.service");
const { response } = require("../utils/response");
const path = require("path");
const { AppError } = require("../utils/response"); 

/**
 * 공유 링크를 생성하는 컨트롤러 함수
 * POST /api/shares
 */
const createShareLink = async (req, res, next) => {
  try {
    const { fileId } = req.body;
    const userId = req.user.id; // auth.js 미들웨어에서 설정된 사용자 ID

    const share = await shareService.createShare(fileId, userId);
    
    // 생성된 공유 링크 URL
    const shareLink = `${req.protocol}://${req.get("host")}/api/shares/${share.token}`;

    response(res, 201, "공유 링크가 성공적으로 생성되었습니다.", { shareLink });
  } catch (err) {
    next(err);
  }
};

/**
 * 공유 링크를 통해 파일을 접근하고 다운로드하는 컨트롤러 함수
 * GET /api/shares/:token
 */
const accessSharedFile = async (req, res, next) => {
  try {
    const { token } = req.params;
    const file = await shareService.getSharedFile(token);

    // 파일의 실제 저장 경로
    const filePath = path.resolve(file.path);

    // 파일 다운로드
    res.download(filePath, file.original_name, (err) => {
      if (err) {
        // 다운로드 중 에러 처리 (예: 파일이 서버에서 삭제된 경우)
        if (!res.headersSent) {
          next(new AppError(404, "FILE_NOT_FOUND_ON_SERVER", "서버에서 파일을 찾을 수 없습니다."));
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createShareLink,
  accessSharedFile,
};
