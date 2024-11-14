npm install express axios
const express = require('express');
const axios = require('axios');
const app = express();

const clientId = 'Ov23liMg3L1ET7Aeu2ei';
const clientSecret = 'd2b1c680766504099c794373c3d8a6ca818a45ab';

app.get('/callback', async (req, res) => {
    const requestToken = req.query.code;
    const tokenResponse = await axios.post(`https://github.com/login/oauth/access_token`, {
        client_id: clientId,
        client_secret: clientSecret,
        code: requestToken
    }, {
        headers: { accept: 'application/json' }
    });

    const accessToken = tokenResponse.data.access_token;
    res.redirect(`/success?token=${accessToken}`);
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
