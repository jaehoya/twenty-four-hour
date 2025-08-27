'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class File extends Model {
    /**
     * 모델 간 관계를 정의하는 메서드
     * Sequelize가 자동으로 호출해주므로,
     * 다른 모델과 관계를 맺고 싶을 때 이 안에서 저으이
     */
    static associate(models) {
      // 나중에 User 모델과 연결 
    }
  }

  /**
   * File 모델 정의
   * 실제 DB 테이블: files
   * 컬럼: 
   *  - user_id: 업로드한 사용자
   *  - original_name: 원본 파일명
   *  - stored_name: 서버/스토리지에 저장된 실제 파일명
   *  - mime_type: 파일 형식
   *  - size: 파일 크기 (bytes)
   *  - path: 파일 저장 경로
   */
  File.init({
    user_id: DataTypes.BIGINT,
    original_name: DataTypes.STRING,
    stored_name: DataTypes.STRING,
    mime_type: DataTypes.STRING,
    size: DataTypes.BIGINT,
    path: DataTypes.STRING
  }, {
    sequelize,          // DB 연결 객체
    modelName: 'File',  // Sequelize에서 사용할 모델명
    tableName: 'files', // 실제 DB 테이블명
    timestamps: true    // createdAt, updatedAt 자동 생성
  });
  return File;
};