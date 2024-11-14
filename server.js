const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

app.post('/create-issue', async (req, res) => {
    const { url } = req.body;
    const token = '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';

    try {
        const response = await axios.post('https://api.github.com/repos/cham-in/youtube-transcriber/issues', {
            title: `[TRANSCRIBE] New Video Request`,
            body: url
        }, {
            headers: {
                'Authorization': `token ${token}`,
                'Content-Type': 'application/json'
            }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create issue' });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
