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

    return user;
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
      const savedFile = await fileService.saveFileMetadata(userId, profileImageFile);
      userProfile.profileImageId = savedFile.id;
      await userProfile.save();
    }

    return this.getProfile(userId);
  }
}

module.exports = new UserProfileService();
