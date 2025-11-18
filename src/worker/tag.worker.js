const { Worker } = require('bullmq');
const { connection } = require('../queue/tag.queue'); 
const File = require('../models/file'); 
const { recommendTagsForFile, saveRecommendedTagsToFile } = require('../services/tag.service'); 

// AI 태그 추천 워커 생성
const tagWorker = new Worker('aiTagQueue', async (job) => {
    const { fileId } = job.data;
    console.log(`[WORKER] Starting AI tag recommendation for file ID: ${fileId}`);

    const file = await File.findByPk(fileId);
    if (!file) {
        // 파일을 찾을 수 없으면 재시도 없이 종료
        console.error(`[WORKER] File ID ${fileId} not found. Skipping job.`);
        return { status: 'file not found' }; 
    }

    // 1. AI 분석 로직 실행 (tag.service에서 분리해온 함수)
    const recommendedTags = await recommendTagsForFile(file); 
    
    // 2. 추천된 태그를 DB에 저장하고 파일과 연결
    await saveRecommendedTagsToFile(fileId, recommendedTags); 

    console.log(`[WORKER] Successfully tagged file ID: ${fileId} with ${recommendedTags.length} tags.`);
    return { status: 'completed', tagsCount: recommendedTags.length };

}, { 
    connection,
    // 워커가 한번에 처리할 수 있는 최대 작업 수 (동시성 설정)
    concurrency: 5 
});

// 워커 이벤트 리스너 (모니터링 용도)
tagWorker.on('completed', (job) => {
  console.log(`[WORKER] Job ${job.id} completed!`);
});

tagWorker.on('failed', (job, err) => {
  console.error(`[WORKER] Job ${job.id} failed with error:`, err.message);
});

console.log(`[WORKER] AI Tag Worker is running, connected to Redis.`);