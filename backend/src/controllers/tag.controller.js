const {
  getTagsByFileId,
  addTagToFile,
  deleteTagById,
  replaceTags,
  searchFilesByTag,
} = require("../services/tag.service");

const { addAiTagJob } = require("../queue/tag.queue");
const File = require("../models/file");
const FileTag = require("../models/fileTag");


// 특정 파일 태그 조회
async function getFileTagsController(req, res, next) {
  try {
    const fileId = req.params.fileId;
    const rows = await getTagsByFileId(fileId);

    const tags = rows.map((t) => t.tag);

    return res.status(200).json({
      state: 200,
      code: "TAGS_FOUND",
      message: "파일의 태그 조회 성공",
      tagCount: tags.length,
      tags,
    });
  } catch (err) {
    next(err);
  }
}


// 태그 추가
async function addTagController(req, res, next) {
  try {
    const fileId = req.params.fileId;
    const { tag } = req.body;

    if (!tag) {
      return res.status(400).json({
        state: 400,
        code: "NO_TAG_PROVIDED",
        message: "추가할 태그를 입력해주세요.",
      });
    }

    const newTag = await addTagToFile(fileId, tag);

    return res.status(201).json({
      state: 201,
      code: "TAG_ADDED",
      message: "태그 추가 성공",
      tag: newTag,
    });
  } catch (err) {
    next(err);
  }
}


// 태그 삭제
async function deleteTagController(req, res, next) {
  try {
    const tagId = req.params.tagId;
    await deleteTagById(tagId);

    return res.status(200).json({
      state: 200,
      code: "TAG_DELETED",
      message: "태그 삭제 성공",
    });
  } catch (err) {
    next(err);
  }
}


// 태그 전체 변경
async function updateAllTagsController(req, res, next) {
  try {
    const fileId = req.params.fileId;
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      return res.status(400).json({
        state: 400,
        code: "INVALID_TAG_FORMAT",
        message: "tags는 배열이어야 합니다.",
      });
    }

    const updatedTags = await replaceTags(fileId, tags);

    return res.status(200).json({
      state: 200,
      code: "TAGS_UPDATED",
      message: "태그 전체 수정 성공",
      tags: updatedTags,
    });
  } catch (err) {
    next(err);
  }
}


// 특정 태그로 파일 검색
async function searchFilesByTagController(req, res, next) {
  try {
    const { tag } = req.query;
    const userId = req.user.id;

    if (!tag) {
      return res.status(400).json({
        state: 400,
        code: "NO_TAG_PROVIDED",
        message: "검색할 태그를 입력해주세요.",
      });
    }

    const files = await searchFilesByTag(userId, tag);

    return res.status(200).json({
      state: 200,
      code: "FILES_FOUND_BY_TAG",
      message: "태그로 파일 검색 성공",
      files,
    });
  } catch (err) {
    next(err);
  }
}


// AI 태그 추천 작업 요청 → Worker가 처리
async function requestAiTagController(req, res, next) {
  try {
    const fileId = req.params.fileId;
    const file = await File.findByPk(fileId);

    if (!file) {
      return res.status(404).json({
        state: 404,
        code: "FILE_NOT_FOUND",
        message: "파일을 찾을 수 없습니다.",
      });
    }

    // 1️⃣ 이미 태그가 존재하는지 확인 (중복 요청 방지)
    const existingTagCount = await FileTag.count({
      where: { file_id: fileId }
    });

    if (existingTagCount > 0) {
      return res.status(400).json({
        state: 400,
        code: "AI_TAG_ALREADY_EXISTS",
        message: "이미 AI 태그가 생성된 파일입니다.",
      });
    }

    // 2️⃣ Redis 큐에 Job 추가
    await addAiTagJob(fileId);

    return res.status(200).json({
      state: 200,
      code: "AI_TAG_JOB_ADDED",
      message: "AI 태그 추천 작업이 큐에 등록되었습니다.",
    });

  } catch (err) {
    next(err);
  }
}


module.exports = {
  getFileTagsController,
  addTagController,
  deleteTagController,
  updateAllTagsController,
  searchFilesByTagController,
  requestAiTagController,
};
