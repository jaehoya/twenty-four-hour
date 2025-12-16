'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('user_profiles', 'profileImage', 'profileImageId');
    await queryInterface.changeColumn('user_profiles', 'profileImageId', {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('user_profiles', 'profileImageId', 'profileImage');
    await queryInterface.changeColumn('user_profiles', 'profileImage', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
