import crypto from 'crypto'

const algorithm = 'aes-256-ctr';

const secretKey = process.env.ENCRYPTION_KEY;

const iv = crypto.randomBytes(16);

export const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

 export const decrypt = (hash) => {
    const parts = hash.split(':');
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(parts.shift(), 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(parts.join(':'), 'hex')), decipher.final()]);

    return decrypted.toString();
}

