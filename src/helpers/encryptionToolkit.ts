import crypto from 'crypto';

const { AES_KEY, ALGORITHM } = process.env;
if (!AES_KEY || !ALGORITHM) throw new Error('Enviroment variables not defined');

/**
 * Generates a random initialization vector (IV) for encryption.
 * This function generates a 16-byte random buffer to be used as an initialization
 * vector (IV)
 * for cryptographic algorithms like AES to ensure security in encryption processes.
 *
 * @returns A 16-byte Buffer containing the generated random IV.
 */
function generateIV(): Buffer {
    return crypto.randomBytes(16);
}

function decryptAES(textToDecrypt: string): string;
function decryptAES(textToDecrypt: string | null | undefined): string | null;

/**
 * Decrypt text using AES decryption.
 * This function decrypts the given encrypted text using AES decryption with
 * the initialization vector (IV) embedded in the encrypted text.
 *
 * @param textToDecrypt - The string to be decrypted, including the IV and the
 * encrypted text.
 * @returns The decrypted text in UTF-8 format.
 */
function decryptAES(textToDecrypt: string | null | undefined): string | null {
    if (textToDecrypt == null) return null;

    const [ivBase64, encryptedBase64] = textToDecrypt.split(':');
    const iv = Buffer.from(ivBase64, 'base64');
    const key = crypto.scryptSync(AES_KEY as string, 'salt', 32);

    const decipher = crypto.createDecipheriv(ALGORITHM as string, key, iv);
    return decipher.update(encryptedBase64, 'base64', 'utf8') + decipher.final('utf8');
}

function encryptAES(textToEncrypt: string): string;
function encryptAES(textToEncrypt: string | null | undefined): string | null;
/**
 * Encrypt text using AES encryption.
 * This function encrypts the given text using AES encryption with a dynamically
 * generated initialization vector (IV).
 *
 * @param textToEncrypt - The string to be encrypted.
 * @returns The encrypted text, including the IV in base64 format and the encrypted
 * text in base64 format.
 */
function encryptAES(textToEncrypt: string | null | undefined): string | null {
    if (textToEncrypt == null) return null;

    const iv = generateIV();
    const cipher = crypto.createCipheriv(
        ALGORITHM as string,
        crypto.scryptSync(AES_KEY as string, 'salt', 32),
        iv,
    );
    return `${iv.toString('base64')}:${cipher.update(textToEncrypt, 'utf8', 'base64')
        + cipher.final('base64')}`;
}

export default { decryptAES, encryptAES };
