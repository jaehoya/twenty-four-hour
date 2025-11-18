'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Share extends Model {
    /**
     * 다른 모델과의 관계를 정의하는 헬퍼 메서드.
     * `models/index` 파일에서 이 메서드를 자동 호출.
     */
    static associate(models) {
      // Share 모델은 File 모델에 속하며, fileId를 외래 키로 함.
      this.belongsTo(models.File, { foreignKey: 'fileId' });
    }
  }
  Share.init(
    {
      id: {
        type: DataTypes.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
      },
      fileId: {
        type: DataTypes.BIGINT.UNSIGNED,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "Share",
      tableName: "shares", 
      timestamps: true,
    }
  );

  return Share;
};