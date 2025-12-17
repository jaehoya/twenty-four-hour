'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('files');
        if (!tableInfo['suggestedFolderId']) {
            await queryInterface.addColumn('files', 'suggestedFolderId', {
                type: Sequelize.BIGINT.UNSIGNED,
                allowNull: true,
                references: {
                    model: 'folders',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            });
        }
    },

    async down(queryInterface, Sequelize) {
        const tableInfo = await queryInterface.describeTable('files');
        if (tableInfo['suggestedFolderId']) {
            await queryInterface.removeColumn('files', 'suggestedFolderId');
        }
    },
};
