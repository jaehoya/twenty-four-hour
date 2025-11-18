const FileTag = require("../models/fileTag");
const File = require("../models/file");
const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const textract = require("textract");
const xlsx = require("xlsx");
const AdmZip = require("adm-zip");
// const hwp = require("node-hwp");

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
async function extractText(filePath, mimeType) {
  console.log(`[AI] extractText → path: ${filePath}, mime: ${mimeType}`);

  try {
    // 1) TXT 파일
    if (mimeType === "text/plain") {
      return fs.readFileSync(filePath, "utf8");
    }

    // 2) CSV 파일
    if (mimeType === "text/csv") {
      return fs.readFileSync(filePath, "utf8");
    }

    // 3) PDF
    if (mimeType === "application/pdf") {
      const buffer = fs.readFileSync(filePath);
      const data = await pdfParse(buffer);
      return data.text;
    }

    // 4) DOCX
    if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    }

    // 5) DOC
    if (mimeType === "application/msword") {
      return await new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (err, text) => {
          if (err) reject(err);
          else resolve(text);
        });
      });
    }

    // 6) XLS / XLSX
    if (
      mimeType === "application/vnd.ms-excel" ||
      mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      const workbook = xlsx.readFile(filePath);
      let text = "";
      workbook.SheetNames.forEach((sheet) => {
        text += xlsx.utils.sheet_to_csv(workbook.Sheets[sheet]);
      });
      return text;
    }

    // 7) PPT / PPTX → textract (가장 간단)
    if (
      mimeType === "application/vnd.ms-powerpoint" ||
      mimeType === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      return await new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (err, text) => {
          if (err) reject(err);
          else resolve(text);
        });
      });
    }

    // 8) 한글 HWP 파일
    if (mimeType === "application/x-hwp" || mimeType === "application/haansofthwp") {
      const hwpDoc = hwp.extract(filePath);
      return hwpDoc;
    }

    // 9) ZIP 파일 → 내부 텍스트 파일만 읽기
    if (mimeType === "application/zip") {
      const zip = new AdmZip(filePath);
      const entries = zip.getEntries();
      let text = "";

      for (const entry of entries) {
        if (
          entry.entryName.endsWith(".txt") ||
          entry.entryName.endsWith(".csv")
        ) {
          text += zip.readAsText(entry);
        }
      }

      return text || "ZIP 파일 내부에 텍스트 파일이 없음";
    }

    // 10) 이미지 → GPT Vision으로 OCR 필요
    if (mimeType.startsWith("image/")) {
      return "(이미지 파일 - Vision API 필요)";
    }

    // 11) 오디오/비디오 → Whisper 필요
    if (mimeType.startsWith("audio/") || mimeType.startsWith("video/")) {
      return "(오디오/비디오 파일 - Whisper/Video 모델 필요)";
    }

    return "";
  } catch (err) {
    console.error("[AI ERROR] extractText:", err);
    throw err;
  }
}

// AI 태그 추천
async function recommendTagsForFile(file) {
  const text = await extractText(file.path, file.mime_type);

  const prompt = `
다음 내용을 보고 적절한 태그 3개를 추천하세요.

❗❗중요:
- JSON 배열만 출력
- 설명 금지
- 코드블록(\`\`\`) 절대 금지
- 예: ["태그1", "태그2", "태그3"]

내용:
${text}
`;

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  let raw = res.choices[0].message.content.trim();

  // 🔥 코드블록 제거
  raw = raw.replace(/```json/gi, "")
           .replace(/```/g, "")
           .trim();

  let tags = [];

  try {
    tags = JSON.parse(raw);
  } catch (err) {
    console.error("JSON parse error:", raw);
    return []; // Worker에 undefined 전달 방지
  }

  return tags;
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
