const userProfileService = require("../services/userProfile.service");

class UserProfileController {
  async getProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const userProfile = await userProfileService.getProfile(userId);
      res.status(200).json(userProfile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const { username } = req.body;
      const profileImageFile = req.file;

      const updatedProfile = await userProfileService.updateProfile(
        userId,
        username,
        profileImageFile
      );

      res.status(200).json(updatedProfile);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserProfileController();
