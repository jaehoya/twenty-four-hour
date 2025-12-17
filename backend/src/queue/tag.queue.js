const { Queue } = require('bullmq');
const Redis = require('ioredis');
require("dotenv").config();

// Redis 연결 설정 
const connection = new Redis({
    // 예를 들어, Docker나 로컬 Redis를 사용할 경우
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || null,
    maxRetriesPerRequest: null,
});

// AI 태그 추천 작업을 위한 큐 이름
const QUEUE_NAME = 'aiTagQueue';

// 큐 인스턴스 생성
const aiTagQueue = new Queue(QUEUE_NAME, { connection });

/**
 * AI 태그 추천 작업을 큐에 추가하는 함수 (Producer 역할)
 * @param {number} fileId - 태그 추천이 필요한 파일 ID
 */
async function addAiTagJob(fileId) {
    if (!fileId) {
        throw new Error("File ID is required to add an AI Tag job.");
    }

    // 작업 데이터와 옵션 정의
    const job = await aiTagQueue.add(
        'recommendTags', // Job 이름
        { fileId }, // Job 데이터 (워커로 전달됨)
        {
            attempts: 5, // 실패 시 최대 5번 재시도
            backoff: { type: 'fixed', delay: 12000 }, // 실패 후 12초 대기 후 재시도
            removeOnComplete: true, // 작업 완료 시 큐에서 제거
            removeOnFail: false
        }
    );
    console.log(`[Queue] Job added (ID: ${job.id}) for fileId: ${fileId}`);
    return job;
}

// 에러 처리 리스너
aiTagQueue.on('error', (err) => {
    console.error('[Queue Error]', err);
});

module.exports = {
    aiTagQueue,
    addAiTagJob,
    connection // 워커 생성 시 사용하기 위해 Export
};