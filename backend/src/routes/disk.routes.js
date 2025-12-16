
const express = require('express');
const router = express.Router();
const diskController = require('../controllers/disk.controller');

/**
 * @swagger
 * /api/disk/usage:
 *   get:
 *     summary: 디스크 사용량 조회
 *     tags: [Disk]
 *     responses:
 *       200:
 *         description: 사용량 조회 성공
 */
router.get('/usage', diskController.getDiskUsage);

module.exports = router;
