import { randomBytes, createCipheriv, createDecipheriv, scryptSync } from 'crypto';
import * as crypto from 'crypto';

// Gerar par de chaves RSA
export function generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
  return new Promise((resolve, reject) => {
    crypto.generateKeyPair('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    }, (err, publicKey, privateKey) => {
      if (err) reject(err);
      resolve({ publicKey, privateKey });
    });
  });
}

// Criptografar chave privada com AES
export function encryptPrivateKey(privateKey: string, password: string): string {
  const salt = randomBytes(16);
  const key = scryptSync(password, salt, 32);
  const iv = randomBytes(16);
  
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(privateKey, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  
  return `${salt.toString('hex')}:${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted.toString('hex')}`;
}

// Descriptografar chave privada
export function decryptPrivateKey(encryptedData: string, password: string): string {
  const [saltHex, ivHex, authTagHex, encryptedHex] = encryptedData.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const encrypted = Buffer.from(encryptedHex, 'hex');
  
  const key = scryptSync(password, salt, 32);
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  
  return Buffer.concat([decipher.update(encrypted), decipher.final()]).toString('utf8');
}

// Gerar hash SHA-256
export function generateHash(text: string): string {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// Assinar texto com chave privada
export function signText(text: string, privateKey: string): string {
  const sign = crypto.createSign('SHA256');
  sign.update(text);
  sign.end();
  return sign.sign(privateKey, 'base64');
}

// Verificar assinatura
export function verifySignature(text: string, signature: string, publicKey: string): boolean {
  const verify = crypto.createVerify('SHA256');
  verify.update(text);
  verify.end();
  return verify.verify(publicKey, signature, 'base64');
}