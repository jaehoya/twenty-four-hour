const FileTag = require("../models/fileTag");
const File = require("../models/file");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Gemini 클라이언트 설정 (gemini-1.5-flash 모델 사용)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const mammoth = require("mammoth");
const textract = require("textract");
const xlsx = require("xlsx");
const AdmZip = require("adm-zip");

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

// 헬퍼 함수 - 확장자 판별 함수: extracText()의 zip에 사용
function guessMimeType(fileName) {
  const ext = path.extname(fileName).toLowerCase();
  const map = {
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
    '.txt': 'text/plain',
    '.csv': 'text/csv',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.zip': 'application/zip',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.hwp': 'application/haansofthwp'
  };

  // 매핑되지 않는 파일은 null 또는 기본값 반환
  return map[ext] || null;
}


// 파일 텍스트 추출 (AI)
async function extractText(filePath, mimeType) {
  console.log(`[AI] extractText → ${filePath.split("/").pop()} (${mimeType})`);

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
      const pdfParse = require("pdf-parse");
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

    // 8) ZIP 파일 → 내부 파일을 재귀적으로 텍스트 추출
    if (mimeType === "application/zip") {
      const zip = new AdmZip(filePath);
      const entries = zip.getEntries();
      let allText = "";

      console.log(`[AI] ZIP Processing: ${entries.length} files found.`);

      for (const entry of entries) {
        // 1. 디렉토리나 맥북 메타데이터(__MACOSX) 무시
        if (entry.isDirectory || entry.entryName.startsWith("__MACOSX/")) continue;

        const entryName = entry.entryName;

        // 2. 파일 타입 추론 (우리가 허용하는 allowedMime 리스트에 있는지만 확인)
        const entryMime = guessMimeType(entryName);

        // 허용되지 않은 확장자라면 건너뜀 (예: .exe, .dll 등)
        if (!entryMime) {
          // console.log(`[AI] Skip unsupported file in ZIP: ${entryName}`);
          continue;
        }

        // 3. 임시 파일 생성 경로 (파일명 충돌 방지 + 경로 단순화)
        const tempFileName = `temp_${Date.now()}_${path.basename(entryName)}`;
        const tempPath = path.join(os.tmpdir(), tempFileName);
        try {
          // 4. 임시 파일 쓰기
          fs.writeFileSync(tempPath, entry.getData());

          // 5. 재귀 호출 (Recursive)
          const innerText = await extractText(tempPath, entryMime);

          // 결과가 있으면 구분선과 함께 추가
          if (innerText && innerText.trim().length > 0) {
            allText += `\n--- [Inner File: ${entryName}] ---\n${innerText}\n`;
          }

        } catch (innerErr) {
          console.warn(`[AI WARNING] ZIP inner extract failed (${entryName}): ${innerErr.message}`);
        } finally {
          // 6. 임시 파일 삭제 
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
        }
      }

      return allText || "ZIP 파일 내부에 텍스트를 추출할 수 있는 파일이 없음";
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

// AI 태그 추천 (Gemini)
async function recommendTagsForFile(file) {
  const text = await extractText(file.path, file.mime_type);

  // 텍스트 길이 제한 (Gemini 속도 최적화 및 오류 방지)
  const truncatedText = text ? text.substring(0, 5000) : "";

  const prompt = `
다음 내용을 보고 내용과 가장 연관성 높은 태그 3개를 추천하세요.

규칙:
- JSON 배열 포맷으로만 출력하세요.
- 설명이나 기타 텍스트는 절대 포함하지 마세요.
- 코드블록(\`\`\`json) 없이 순수 배열만 출력하세요.
- 예시: ["계약서", "부동산", "2024년"]

내용:
${truncatedText}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let raw = response.text();

    console.log("[Gemini Raw Tag Output]", raw);

    // 코드블록 및 불필요한 공백/텍스트 제거 정제
    raw = raw.replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // JSON 부분만 추출 (혹시 앞뒤에 말이 붙을 경우 대비)
    const firstBracket = raw.indexOf('[');
    const lastBracket = raw.lastIndexOf(']');
    if (firstBracket !== -1 && lastBracket !== -1) {
      raw = raw.substring(firstBracket, lastBracket + 1);
    }

    let tags = [];
    tags = JSON.parse(raw);
    return tags;

  } catch (err) {
    console.error("Gemini Tag/Parse Error:", err);
    return [];
  }
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

// AI에게 태그와 기존 폴더 목록을 주고 최적의 폴더를 추천받는 함수 (Gemini)
async function recommendFolderForFile(tags, existingFolders) {
  if (!existingFolders || existingFolders.length === 0) return null;

  const folderNames = existingFolders.map(f => f.name).join(", ");
  const tagNames = tags.join(", ");

  const prompt = `
  다음 태그를 가진 파일을 어느 폴더에 넣는 것이 가장 적절할지 선택하세요.
  
  [파일 태그]
  ${tagNames}
  
  [사용자의 현재 폴더 목록]
  ${folderNames}
  
  규칙:
  1. 가장 적절한 폴더 이름을 하나만 출력하세요.
  2. 만약 적절한 폴더가 전혀 없다면 "NULL" 이라고만 출력하세요.
  3. 설명이나 다른 텍스트는 절대 포함하지 마세요.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendedName = response.text().trim();

    console.log(`[Gemini Folder] Recommended: ${recommendedName}`);

    if (recommendedName.includes("NULL")) return null;

    // 추천된 이름이 포함된 폴더 찾기
    const folder = existingFolders.find(f => recommendedName.includes(f.name));
    return folder || null;

  } catch (err) {
    console.error("[Gemini Folder] Recommendation failed:", err);
    return null;
  }
}

module.exports = {
  getTagsByFileId,
  addTagToFile,
  deleteTagById,
  replaceTags,
  searchFilesByTag,
  recommendTagsForFile,
  saveRecommendedTagsToFile,
  recommendFolderForFile,
};

