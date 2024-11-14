const { getVideoMetadata } = require('./youtube');
const { transcribeWithContext } = require('./transcribe');
const { summarizeTranscription } = require('./summarize');

async function processVideo(videoUrl) {
    try {
        // 1. 비디오 메타데이터 가져오기
        console.log('메타데이터 가져오는 중...');
        const metadata = await getVideoMetadata(videoUrl);

        // 2. 오디오 전사
        console.log('오디오 전사 중...');
        const transcription = await transcribeWithContext(metadata.audioUrl, metadata);

        // 3. 전사 내용 요약
        console.log('전사 내용 요약 중...');
        const summary = await summarizeTranscription(transcription, metadata);

        // 4. 컨텍스트를 활용한 개선된 전사
        console.log('전사 내용 개선 중...');
        const enhancedTranscription = await transcribeWithContext(
            metadata.audioUrl,
            metadata,
            summary
        );

        return {
            metadata,
            summary,
            enhancedTranscription
        };
    } catch (error) {
        console.error('비디오 처리 중 오류:', error);
        throw error;
    }
}

module.exports = { processVideo };
