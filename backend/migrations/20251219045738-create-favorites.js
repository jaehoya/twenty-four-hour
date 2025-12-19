'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      targetId: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      targetType: {
        type: Sequelize.ENUM('file', 'folder'),
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint('favorites', {
      fields: ['userId', 'targetId', 'targetType'],
      type: 'unique',
      name: 'uniq_favorite',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('favorites');
  },
};
