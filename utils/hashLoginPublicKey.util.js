import crypto from "crypto";

export async function hashLoginPublicKey (passwordRaw, publicKey) {
    try {
        return (crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            // oaepHash: 'sha256'
        },Buffer.from(passwordRaw))).toString('base64')
    } catch (e) {
        throw new Error(e.message)
    }
}