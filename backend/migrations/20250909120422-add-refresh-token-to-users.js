'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // users 테이블에 refreshToken 컬럼 추가
    const table = await queryInterface.describeTable('users');
    if (!table.refreshToken) {
      await queryInterface.addColumn('users', 'refreshToken', {
        type: Sequelize.STRING(500),
        allowNull: true,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    // 되돌릴 때 refreshToken 컬럼 제거
    await queryInterface.removeColumn('users', 'refreshToken');
  }
};
