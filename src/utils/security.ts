require('dotenv').config();
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import * as constants from 'constants';

/**
 * Security credentials are generated by encrypting the base64 encoded initiator
 * password with M-Pesa’s public key, a X509 certificate
 * (for B2C, B2B, Transaction Status, Reversal, Account Balance APIs)
 * @param credential Shortcode security credential
 */
export async function generateSecurityCredentials(credential: string) {
    const credToEncrypt: Buffer = Buffer.from(credential),
        privateKey = fs.readFileSync(path.join(process.env.CERTIFICATE_FILE_PATH)).toString();

    return await crypto
        .publicEncrypt(
            {
                key: privateKey,
                padding: constants.RSA_PKCS1_PADDING,
            },
            credToEncrypt
        )
        .toString('base64');
}