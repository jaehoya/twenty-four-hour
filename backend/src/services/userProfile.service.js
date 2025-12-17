const { User, UserProfile, File } = require("../models");
const fileService = require("./file.service");

class UserProfileService {
  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      include: [{
        model: UserProfile,
        include: [{
          model: File,
          as: 'ProfileImage',
          attributes: ['path'],
        }],
        attributes: { exclude: ['userId', 'profileImageId', 'createdAt', 'updatedAt'] },
      }],
      attributes: ['email', 'username'],
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userData = user.toJSON();

    if (userData.UserProfile?.ProfileImage?.path) {
      const fullPath = userData.UserProfile.ProfileImage.path;
      const index = fullPath.lastIndexOf('uploads');
      if (index !== -1) {
        userData.UserProfile.ProfileImage.path = fullPath.substring(index).replace(/\\/g, '/');
      }
    }

    return userData;
  }

  async updateProfile(userId, username, profileImageFile) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (username) {
      user.username = username;
      await user.save();
    }

    let userProfile = await UserProfile.findOne({ where: { userId } });

    if (!userProfile) {
      userProfile = await UserProfile.create({ userId });
    }

    if (profileImageFile) {
      try {
        const savedFile = await fileService.saveFileMetadata(userId, profileImageFile);
        userProfile.profileImageId = savedFile.id;
        await userProfile.save();
      } catch (error) {
        console.error("Profile Image Save Error:", error);
        throw new Error(`프로필 이미지 저장 실패: ${error.message}`);
      }
    }

    return this.getProfile(userId);
  }
}

module.exports = new UserProfileService();
