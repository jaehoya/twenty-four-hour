const { User, UserProfile } = require("../models");

class UserProfileService {
  async getProfile(userId) {
    const user = await User.findByPk(userId, {
      include: [{
        model: UserProfile,
        attributes: ['profileImage'],
      }],
      attributes: ['email', 'username'],
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async updateProfile(userId, username, profileImage) {
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

    if (profileImage) {
      userProfile.profileImage = profileImage;
      await userProfile.save();
    }

    return this.getProfile(userId);
  }
}

module.exports = new UserProfileService();
