const youtubedl = require('youtube-dl-exec');

async function getVideoMetadata(videoUrl) {
    try {
        const videoInfo = await youtubedl(videoUrl, {
            dumpSingleJson: true,
            noWarnings: true,
            noCallHome: true,
            noCheckCertificate: true,
            preferFreeFormats: true,
            youtubeSkipDashManifest: true
        });

        return {
            title: videoInfo.title,
            description: videoInfo.description,
            tags: videoInfo.tags || [],
            audioUrl: videoInfo.formats.find(f => f.acodec !== 'none' && f.vcodec === 'none')?.url
        };
    } catch (error) {
        console.error('YouTube 메타데이터 수집 중 오류:', error);
        throw error;
    }
}

module.exports = { getVideoMetadata };
