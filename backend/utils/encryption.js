const CryptoJS = require('crypto-js');

const SECRET_KEY = process.env.AES_SECRET_KEY || 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6';
const IV = process.env.AES_IV || 'f1e2d3c4b5a6f7e8';

/**
 * Encrypt a plaintext string using AES-256-CBC
 */
const encrypt = (text) => {
    if (!text) return text;
    const key = CryptoJS.enc.Hex.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Hex.parse(IV);
    const encrypted = CryptoJS.AES.encrypt(text, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
};

/**
 * Decrypt an AES-256-CBC encrypted string
 */
const decrypt = (encryptedText) => {
    if (!encryptedText) return encryptedText;
    const key = CryptoJS.enc.Hex.parse(SECRET_KEY);
    const iv = CryptoJS.enc.Hex.parse(IV);
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
