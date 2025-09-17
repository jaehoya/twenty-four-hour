const express = require("express");
const router = express.Router();
const userProfileController = require("../controllers/userProfile.controller");
const authMiddleware = require("../middlewares/auth");
const upload = require("../middlewares/upload");
const { updateProfileValidator } = require("../middlewares/validators/user.dto");

// GET /api/profile/me -> 내 프로필 조회
router.get("/me", authMiddleware, userProfileController.getProfile);

// PUT /api/profile/me -> 내 프로필 수정
router.put("/me", authMiddleware, upload.single('profileImage'), updateProfileValidator, userProfileController.updateProfile);

module.exports = router;
