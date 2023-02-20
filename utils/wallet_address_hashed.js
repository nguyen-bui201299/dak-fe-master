import sha512 from 'sha512'

// Get the hashed key
const key = process.env.NEXT_PUBLIC_TRANSFER_HASHED_ADDRESS_KEY;

export function WalletAddressHasher (data) {
    const hasher = sha512.hmac(key)
    
    // Start hashed the address wallet
    const hashedWallet = hasher.finalize(data.wallet_address)
    const hashedAmount = hasher.finalize(data.amount)
    const hashedNote = hasher.finalize(data.note)
    data.wallet_address = hashedWallet.toString('hex')
    data.amount = hashedAmount.toString('hex')
    data.note = hashedNote.toString('hex')
    
    return data;
}