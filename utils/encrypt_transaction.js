// import sha512 from 'sha512'
import crypto from "crypto";
import { HmacSHA512, SHA512 } from 'crypto-js';


export async function EncryptTransaction (data, publicKey) {
    try {
        const message = data.toString();
        const codeHash = HmacSHA512(process.env.KEY_HASH, message);
        const code = message + process.env.KEY_JOINER + codeHash
        
        const encrypted = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            // oaepHash: 'sha256'
            },Buffer.from(code))
    
        data = encrypted.toString('base64')
        return data;
    } catch (e) {
        throw new Error(e.message)
    }
    
}


