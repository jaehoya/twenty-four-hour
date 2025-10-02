
const express = require('express');
const router = express.Router();
const diskController = require('../controllers/disk.controller');

router.get('/usage', diskController.getDiskUsage);

module.exports = router;
