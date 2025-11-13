'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Share extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.File, { foreignKey: 'fileId' });
    }
  }
  Share.init({
    token: DataTypes.STRING,
    fileId: DataTypes.INTEGER,
    expiresAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Share',
  });
  return Share;
};