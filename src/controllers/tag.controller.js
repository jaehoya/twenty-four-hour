const {
  getTagsByFileId,
  addTagToFile,
  deleteTagById,
  replaceTags,
  searchFilesByTag,
  recommendTagsForFile,
} = require("../services/tag.service");

const File = require("../models/file");

// 특정 파일의 태그 조회
exports.getFileTags = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const tags = await getTagsByFileId(fileId);

    return res.json({
      state: 200,
      code: "TAGS_FOUND",
      tags,
    });
  } catch (err) {
    next(err);
  }
};

// 태그 추가
exports.addTag = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({ message: "태그를 입력해주세요." });
    }

    const newTag = await addTagToFile(fileId, tag);

    return res.json({
      state: 201,
      code: "TAG_ADDED",
      tag: newTag,
    });
  } catch (err) {
    next(err);
  }
};

// 태그 삭제
exports.deleteTag = async (req, res, next) => {
  try {
    const tagId = req.params.tagId;
    await deleteTagById(tagId);

    return res.json({
      state: 200,
      code: "TAG_DELETED",
      message: "태그가 삭제되었습니다.",
    });
  } catch (err) {
    next(err);
  }
};

// 태그 전체 수정
exports.updateAllTags = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "tags는 배열이어야 합니다." });
    }

    const newTags = await replaceTags(fileId, tags);

    return res.json({
      state: 200,
      code: "TAGS_UPDATED",
      tags: newTags,
    });
  } catch (err) {
    next(err);
  }
};

// 태그 검색 (tag=xxx)
exports.searchFilesByTag = async (req, res, next) => {
  try {
    const { tag } = req.query;
    const userId = req.user.id;

    if (!tag) {
      return res.status(400).json({ message: "검색할 태그가 필요합니다." });
    }

    const files = await searchFilesByTag(userId, tag);

    return res.json({
      state: 200,
      code: "FILES_FOUND_BY_TAG",
      files
    });
  } catch (err) {
    next(err);
  }
};

// AI 태그 추천
exports.recommendTags = async (req, res, next) => {
  try {
    const fileId = req.params.fileId;
    const file = await File.findByPk(fileId);

    if (!file) {
      return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
    }

    const recommended = await recommendTagsForFile(file);

    return res.json({
      state: 200,
      code: "TAG_RECOMMENDATION",
      recommended,
    });

  } catch (err) {
    next(err);
  }
};
