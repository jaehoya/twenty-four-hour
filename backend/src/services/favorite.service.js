const { Favorite, File, Folder } = require("../models");

// 즐겨찾기 추가
async function addFavorite(userId, targetId, targetType) {
    // 중복 체크
    const exists = await Favorite.findOne({ where: { userId, targetId, targetType } });
    if (exists) {
        return exists;
    }

    return await Favorite.create({ userId, targetId, targetType });
}

// 즐겨찾기 제거
async function removeFavorite(userId, targetId, targetType) {
    return await Favorite.destroy({
        where: { userId, targetId, targetType },
    });
}

// 즐겨찾기 목록 조회
async function getFavorites(userId) {
    return await Favorite.findAll({
        where: { userId },
        include: [
            { model: File, attributes: ["id", "original_name", "size"], required: false },
            { model: Folder, attributes: ["id", "name"], required: false },
        ],
        order: [["createdAt", "DESC"]],
    });
}

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites,
};