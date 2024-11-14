const { Configuration, OpenAIApi } = require('openai');
const config = require('./config');

const configuration = new Configuration({
    apiKey: config.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function summarizeTranscription(transcription, metadata) {
    try {
        const prompt = `
        다음 유튜브 영상의 전사 내용을 요약해주세요:
        
        제목: ${metadata.title}
        태그: ${metadata.tags.join(', ')}
        설명: ${metadata.description}
        
        전사 내용:
        ${transcription}
        
        위 내용을 300자 이내로 간단히 요약해주세요.`;

        const response = await openai.createCompletion({
            model: 'gpt-4-1106-preview',
            prompt: prompt,
            temperature: 0.3,
            max_tokens: 500
        });

        return response.data.choices[0].text.trim();
    } catch (error) {
        console.error('요약 중 오류:', error);
        throw error;
    }
}

module.exports = { summarizeTranscription };
