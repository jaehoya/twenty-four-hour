const { FileTag, File } = require("../models/fileTag");
const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 특정 파일의 태그 조회
async function getTagsByFileId(fileId) {
  return FileTag.findAll({
    where: { file_id: fileId },
    attributes: ["id", "tag"],
  });
}

// 태그 추가
async function addTagToFile(fileId, tag) {
  return FileTag.create({ file_id: fileId, tag });
}

// 태그 삭제
async function deleteTagById(tagId) {
  return FileTag.destroy({ where: { id: tagId } });
}

// 태그 전체 수정
async function replaceTags(fileId, tags) {
  await FileTag.destroy({ where: { file_id: fileId } });

  const results = [];
  for (const tag of tags) {
    const r = await FileTag.create({ file_id: fileId, tag });
    results.push(r);
  }
  return results;
}

// 태그로 파일 검색
async function searchFilesByTag(userId, tag) {
  return File.findAll({
    where: { user_id: userId },
    include: [
      {
        model: FileTag,
        as: "tags",
        where: { tag },
        required: true,
      },
    ],
  });
}

// 파일 텍스트 추출 (AI)
async function extractText(path, mimeType) {
  const buffer = fs.readFileSync(path);

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            input_text: {
              mime_type: mimeType,
              data: buffer
            },
          },
        ],
      },
    ],
  });

  return res.choices[0].message.content;
}

// AI 태그 추천
async function recommendTagsForFile(file) {

  const text = await extractText(file.path, file.mime_type);

  const prompt = `
다음 파일의 내용을 분석하고 적절한 태그 3개를 추천하세요.
응답은 ["tag1", "tag2"] 형식의 JSON 배열로만 주세요.

내용:
${text}
`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_array" },
  });

  return res.choices[0].message.parsed;
}

// Worker가 호출하는 태그 저장 함수 
async function saveRecommendedTagsToFile(fileId, tags) {
  const results = [];

  for (const tag of tags) {
    
    // 이미 존재하는 태그인지 확인
    const exists = await FileTag.findOne({
      where: { file_id: fileId, tag }
    });

    // 있으면 push하고 continue
    if (exists) {
      results.push(exists);
      continue;
    }

    // 없으면 새로 추가
    const newTag = await FileTag.create({
      file_id: fileId,
      tag,
    });

    results.push(newTag);
  }

  return results;
}


module.exports = {
  getTagsByFileId,
  addTagToFile,
  deleteTagById,
  replaceTags,
  searchFilesByTag,
  recommendTagsForFile,
  saveRecommendedTagsToFile, 
};
