
const diskService = require('../services/disk.service');

class DiskController {
  async getDiskUsage(req, res) {
    try {
      const usage = await diskService.getDiskUsage();
      const total = usage.total;
      const used = usage.used;
      const free = total - used;

      res.status(200).json({
        state: 200,
        code: "DISK_USAGE_RETRIEVED",
        message: '디스크 사용량 조회 성공',
        data: {
          total,
          used,
          free,
        },
      });
    } catch (error) {
      res.status(500).json({ 
        state: 500,
        code: "DISK_USAGE_ERROR",
        message: "디스크 사용량 정보를 가져오는 중 오류가 발생했습니다.",
      });
    }
  }
}

module.exports = new DiskController();
