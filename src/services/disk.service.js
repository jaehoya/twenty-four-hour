const fs = require('fs');
const path = require('path');

class DiskService {
  // 재귀적으로 폴더 크기를 계산하는 함수
  getFolderSize(directoryPath) {
    let totalSize = 0;
    const items = fs.readdirSync(directoryPath);

    for (const item of items) {
      const itemPath = path.join(directoryPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isFile()) {
        totalSize += stats.size;
      } else if (stats.isDirectory()) {
        totalSize += this.getFolderSize(itemPath);
      }
    }
    return totalSize;
  }

  async getDiskUsage() {
    try {
      const uploadsPath = path.join(__dirname, '../uploads');
      
      // uploads 폴더가 없으면 생성
      if (!fs.existsSync(uploadsPath)) {
        fs.mkdirSync(uploadsPath, { recursive: true });
      }

      const used = this.getFolderSize(uploadsPath);
      const total = 15 * 1024 * 1024 * 1024; // 15GB in bytes

      return { total, used };
    } catch (error) {
      throw new Error('디스크 사용량 정보를 가져오는 중에 오류가 발생했습니다: ' + error.message);
    }
  }
}

module.exports = new DiskService();