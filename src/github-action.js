const core = require('@actions/core');
const github = require('@actions/github');
const { processVideo } = require('./index');

async function run() {
    try {
        const context = github.context;
        const issue = context.payload.issue;
        const issueBody = issue.body;
        
        // YouTube URL 추출
        const urlMatch = issueBody.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([^\s&]+)/);
        if (!urlMatch) {
            throw new Error('유효한 YouTube URL을 찾을 수 없습니다.');
        }

        const videoUrl = urlMatch[0];
        
        // 비디오 처리
        const result = await processVideo(videoUrl);

        // 결과 포맷팅
        const resultComment = `
## 전사 결과

### 메타데이터
- 제목: ${result.metadata.title}
- 태그: ${result.metadata.tags.join(', ')}

### 요약
${result.summary}

### 최종 전사 내용
\`\`\`
${result.enhancedTranscription}
\`\`\`
        `;

        console.log(resultComment);
        
    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = { run };
