import Token from '../models/Token.js'
import { encrypt, decrypt } from './crypto.js'

export const saveToken = async (userId, accessToken, refreshToken, expiresIn) =>{
    const encryptedAccessToken = encrypt(accessToken);
    const encryptedRefreshToken = encrypt(refreshToken);
    const expiryDate = new Date(new Date().getTime() + expiresIn * 1000);

    await Token.updateOne( {userId }, {
        accessToken: encryptedAccessToken,
        refreshToken: encryptedRefreshToken,
        expiresIn: expiryDate
    }, {upsert: true});
};

export const getTokenForUser = async (userId) => {
    try {
        const tokenDoc = await Token.findOne({ userId });

        if (!tokenDoc) return null;

        const accessToken = decrypt(tokenDoc.accessToken);
        const refreshToken = decrypt(tokenDoc.refreshToken);
        
        // Check if the access token has expired
        if (new Date() > new Date(tokenDoc.expiresIn)) {
            console.log('Token has expired');
            return null; 
        }

        return {
            accessToken,
            refreshToken,
            expiresIn: tokenDoc.expiresIn
        };
    } catch (error) {
        console.error('Error fetching token for user:', error);
        return null;
    }
};