// lib/auth.ts
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto';

// Função para hash de senha usando crypto (scrypt)
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Gera salt aleatório
      const salt = randomBytes(16).toString('hex');
      
      // Gera hash com scrypt
      const derivedKey = scryptSync(password, salt, 64);
      
      // Concatena salt e hash
      const hashedPassword = `${salt}:${derivedKey.toString('hex')}`;
      
      resolve(hashedPassword);
    } catch (error) {
      reject(error);
    }
  });
}

// Função para verificar senha - ESTA É A verifyPassword
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    try {
      const [salt, key] = hashedPassword.split(':');
      const keyBuffer = Buffer.from(key, 'hex');
      const derivedKey = scryptSync(password, salt, 64);
      
      // Usa comparação segura contra timing attacks
      const match = timingSafeEqual(keyBuffer, derivedKey);
      resolve(match);
    } catch (error) {
      reject(error);
    }
  });
}