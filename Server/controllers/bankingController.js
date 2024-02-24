import axios from "axios";
import { getTokenForUser } from '../utils/tokenStorage.js';
import dotenv from 'dotenv';

export const handleData = async (req, res) => {
    // Hard-coded userId for testing
    const userId = 'joaoTest'; 
    const accountUid = process.env.ACCOUNT_UID;

    try {
        // Retrieve the user's access token from storage
        const tokenInfo = await getTokenForUser(userId);
        if (!tokenInfo || !tokenInfo.accessToken) {
            return res.status(401).json({ error: "Access Token not found or expired." });
        }

        // Use the retrieved access token for the API call
        const response = await axios.get('https://api-sandbox.starlingbank.com/api/v2/accounts', {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenInfo.accessToken}`
            }
        });

        res.status(200).json(response.data); // Send the API response data back to the client
    } catch (error) {
        console.error('Error fetching Starling Bank account data:', error.response ? error.response.status : 'No response', error.response ? error.response.data : 'No data', error.response ? error.response.headers : 'No headers');

        // Handle different response scenarios based on the error response status
        if (error.response && error.response.status === 403) {
            res.status(403).send('Forbidden - Access Denied');
        } else if (error.response && error.response.status === 404) {
            res.status(404).json({
                error: 'Resource not found',
                headers: error.response.headers,
            });
        } else {
            res.status(500).json({
                error: `Error fetching Starling Bank account data: ${error.message}`,
                headers: error.response ? error.response.headers : {},
            });
        }
    }
};

export const handleBalance = async (req, res) => {
    // Hard-coded userId for testing
    const userId = 'joaoTest'; 
    const accountUid = process.env.ACCOUNT_UID;
    
    try {
        // Retrieve the user's access token from storage
        const tokenInfo = await getTokenForUser(userId);
        if (!tokenInfo || !tokenInfo.accessToken) {
            return res.status(401).json({ error: "Access Token not found or expired." });
        }

        // Use the retrieved access token for the API call
        const response = await axios.get(`https://api-sandbox.starlingbank.com/api/v2/accounts/${accountUid}/balance`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenInfo.accessToken}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Starling Bank account data:', error.response ? error.response.status : 'No response', error.response ? error.response.data : 'No data', error.response ? error.response.headers : 'No headers');

        if (error.response && error.response.status === 403) {
            res.status(403).send('Forbidden - Access Denied');
        } else if (error.response && error.response.status === 404) {
            res.status(404).json({
                error: 'Resource not found',
                headers: error.response.headers,
            })

        } else {
            res.status(500).json({
                error: `Error fetching Starling Bank account data: ${error.message}`,
                headers: error.response ? error.response.headers : {},
            });
        }
    }
};

export const handleFlowIn = async (req, res) => {
    // Hard-coded userId for testing
    const userId = 'joaoTest'; 
    const accountUid = process.env.ACCOUNT_UID;
    const categoryUid = '2730cbbe-5f0f-42e5-b7a0-4d9a1d714c03'//'defaultCategoryUid' //Most of the payment and transaction feed API endpoints take the category UID as a path parameter, so you'll need to know defaultCategoryUid for an account in order to access the main account balance and the main transaction feed
    const changesSince = '2020-01-01T12:34:56.000Z'
    try {
        const tokenInfo = await getTokenForUser(userId);
        if (!tokenInfo || !tokenInfo.accessToken) {
            return res.status(401).json({ error: "Access Token not found or expired." });
        }

        // Use the retrieved access token for the API call
        const response = await axios.get(`https://api-sandbox.starlingbank.com/api/v2/feed/account/${accountUid}/category/${categoryUid}?changesSince=${changesSince}`, {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": `Bearer ${tokenInfo.accessToken}`
            }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching Starling Bank account data:', error.response ? error.response.status : 'No response', error.response ? error.response.data : 'No data', error.response ? error.response.headers : 'No headers');

        if (error.response && error.response.status === 403) {
            res.status(403).send('Forbidden - Access Denied');
        } else if (error.response && error.response.status === 404) {
            res.status(404).json({
                error: 'Resource not found',
                headers: error.response.headers,
            })

        } else {
            res.status(500).json({
                error: `Error fetching Starling Bank account data: ${error.message}`,
                headers: error.response ? error.response.headers : {},
            });
        }
    }
};