const { Configuration, OpenAIApi } = require('openai');
const config = require('./config');
const axios = require('axios');
const fs = require('fs');

const configuration = new Configuration({
    apiKey: config.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

async function transcribeWithContext(audioPath, metadata, summary = null) {
    try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(audioPath));
        formData.append('model', 'whisper-1');
        formData.append('language', 'ko');

        const transcriptionResponse = await axios.post(
            'https://api.openai.com/v1/audio/transcriptions',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${config.OPENAI_API_KEY}`
                }
            }
        );

        const transcription = transcriptionResponse.data.text;

        if (summary) {
            const enhancedPrompt = `
            컨텍스트 정보:
            제목: ${metadata.title}
            태그: ${metadata.tags.join(', ')}
            설명: ${metadata.description}
            요약: ${summary}
            
            원본 전사: ${transcription}
            
            위 전사 내용을 컨텍스트를 참고하여 더 정확하게 교정해주세요.`;

            const enhancedResponse = await openai.createCompletion({
                model: 'gpt-4-1106-preview',
                prompt: enhancedPrompt,
                temperature: 0.3,
                max_tokens: 1500
            });

            return enhancedResponse.data.choices[0].text.trim();
        }

        return transcription;
    } catch (error) {
        console.error('전사 중 오류:', error);
        throw error;
    }
}

module.exports = { transcribeWithContext };
