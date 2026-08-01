import bcrypt from 'bcryptjs';

/**
 * Encrypts / hashes passwords securely using bcrypt.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verifies a plain text password against a bcrypt hash.
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Safely masks credential secrets so full credentials are NEVER exposed to frontend.
 */
export function maskCredential(credential: string): string {
  if (!credential || credential.length <= 4) {
    return '****';
  }
  const visible = credential.slice(-4);
  return `****************${visible}`;
}
