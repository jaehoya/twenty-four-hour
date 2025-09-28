const {
    addFavorite, 
    removeFavorite,
    getFavorites
} = require("../services/favorite.service");

// 즐겨찾기 추가 컨트롤러
async function addFavoriteController(req, res, next) {
    try {
        const userId = req.user.id;
        const { targetId, targetType } = req.body;

        if (!targetId || !targetType) {
            return res.status(400).json({
                state: 400,
                code: "INVALID_INPUT",
                message: "targetId와 targetType(file|folder)은 필수입니다.",
            });
        }

        const favorite = await addFavorite(userId, targetId, targetType);

        return res.status(201).json({
            state: 201,
            code: "FAVORITE_ADDED",
            message: "즐겨찾기 추가 성공",
            favorite
        });
    } catch (err) {
        next(err);
    }
}

// 즐겨찾기 제거 컨트롤러
async function removeFavoriteController(req, res, next) {
  try {
    const userId = req.user.id;
    const { targetId, targetType } = req.body;

    if (!targetId || !targetType) {
      return res.status(400).json({
        state: 400,
        code: "INVALID_INPUT",
        message: "targetId와 targetType(file|folder)은 필수입니다.",
      });
    }

    const deleted = await removeFavorite(userId, targetId, targetType);

    if (!deleted) {
      return res.status(404).json({
        state: 404,
        code: "FAVORITE_NOT_FOUND",
        message: "즐겨찾기가 존재하지 않습니다.",
      });
    }

    return res.status(200).json({
      state: 200,
      code: "FAVORITE_REMOVED",
      message: "즐겨찾기 제거 성공",
    });
  } catch (err) {
    next(err);
  }
}

// 즐겨찾기 목록 조회 컨트롤러
async function getFavoritesController(req, res, next) {
  try {
    const userId = req.user.id;
    const favorites = await getFavorites(userId);

    return res.status(200).json({
      state: 200,
      code: "FAVORITES_LIST",
      message: "즐겨찾기 목록 조회 성공",
      favorites,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
    addFavoriteController,
    removeFavoriteController,
    getFavoritesController,
};