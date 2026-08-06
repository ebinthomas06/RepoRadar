import { randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

// NFR-4: "All user OAuth tokens ... must be encrypted at rest using
// AES-256-GCM." This module is the only place that should touch raw
// GitHub access/refresh tokens before they're written to the accounts
// table, and the only place that decrypts them back out.

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit nonce, standard for GCM

function getKey(): Buffer {
  const b64 = process.env.AUTH_TOKEN_ENCRYPTION_KEY;
  if (!b64) {
    throw new Error(
      "AUTH_TOKEN_ENCRYPTION_KEY is not set. Generate one with: " +
        "node -e \"console.log(require('crypto').randomBytes(32).toString('base64'))\""
    );
  }
  const key = Buffer.from(b64, "base64");
  if (key.length !== 32) {
    throw new Error(
      `AUTH_TOKEN_ENCRYPTION_KEY must decode to 32 bytes, got ${key.length}`
    );
  }
  return key;
}

/**
 * Encrypts a plaintext token. Output format: base64(iv) + "." +
 * base64(authTag) + "." + base64(ciphertext) — stored as-is in
 * accounts.access_token_cipher / accounts.refresh_token_cipher.
 */
export function encryptToken(plaintext: string): string {
  const key = getKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
}

/**
 * Reverses encryptToken(). Throws if the payload was tampered with
 * (GCM auth tag check fails) or the key is wrong.
 */
export function decryptToken(payload: string): string {
  const key = getKey();
  const [ivB64, tagB64, ciphertextB64] = payload.split(".");
  if (!ivB64 || !tagB64 || !ciphertextB64) {
    throw new Error("Malformed token ciphertext payload");
  }

  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(ciphertextB64, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const plaintext = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return plaintext.toString("utf8");
}
