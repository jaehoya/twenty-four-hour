
const diskService = require('../services/disk.service');

class DiskController {
  async getDiskUsage(req, res) {
    try {
      const usage = await diskService.getDiskUsage();
      const total = usage.total;
      const used = usage.used;
      const free = total - used;

      res.status(200).json({
        message: 'Disk usage retrieved successfully',
        data: {
          total,
          used,
          free,
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new DiskController();
