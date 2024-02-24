import express from 'express';
import axios from 'axios';
import qs from 'qs'; // For encoding form data
import dotenv from 'dotenv';
import { saveToken, getTokenForUser } from '../utils/tokenStorage.js';

dotenv.config();

const router = express.Router();


const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.STARLING_SECRET;
const redirectURI = 'http://localhost:5001/callback';

router.get('/callback', async (req, res) => {
console.log('/callback query parameters:', req.query)
    const authorizationCode = req.query.code;
    if (!authorizationCode) {
        return res.status(400).send('Authorization code is missing');
    }

    try {
        // Prepare the data for the token exchange
        const data = qs.stringify({
            grant_type: 'authorization_code',
            client_id: clientID,
            client_secret: clientSecret,
            code: authorizationCode,
            redirect_uri: redirectURI,
        });

        // Make the request to exchange the authorization code for an access token
        console.log("Exchanging authorization code for access token. Data:", data);
        const response = await axios.post('https://api-sandbox.starlingbank.com/oauth/access-token', data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });
        console.log("Token exchange response:", response.data);

        // Extract the access token from the response
        const { access_token, refresh_token, expires_in } = response.data

        const userId = 'joaoTest'

        await saveToken(userId, access_token, refresh_token, expires_in);

        res.send({message: "Access token stored successfully" });
    } catch (error) {
        console.error('Error exchanging authorization code for access token:', error.response ? error.response.data : error);
        res.status(500).send('Internal Server Error');
    }
});


export default router;

