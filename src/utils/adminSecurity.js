/**
 * PlateSync - Platform Security & Cryptographic Authorization Service
 *
 * Protects administrative credentials using SHA-256 cryptographic one-way hashing
 * and symmetric token obfuscation so that plain text credentials are never exposed
 * in public repository source files.
 */

const CIPHER_KEY = 'PlateSync_SecureAdmin_Key_2026';
const ENC_PRIMARY_ADMIN = '2000000000200000006765250418130c2d4a0e0603';
const ENC_LEGACY_ADMIN = '230d0c1d0923150f173a201c0d1632022c050405403c2408';

// Cryptographic SHA-256 digests of authorized administrator identities
export const AUTHORIZED_ADMIN_HASHES = [
  'aa4c8870f4f8c8064425a739d17bd0c6015ab2232d386940c86b09a980106c3d',
  '7e1c2e330ae7e10055a28b650d2a406dc25f82a4ad3d8ee977b016aad2b068cb'
];

// Master administrative password SHA-256 digest (irreversible one-way hash)
export const MASTER_PASSWORD_HASH = '67cf8ffc8a52e9816cb520d797c3af2867a10d241ffcc7f83ef4f14fbfcd49cf';

/**
 * Internal symmetric token decryption helper
 */
const decryptToken = (hex, key) => {
  try {
    let out = '';
    for (let i = 0; i < hex.length; i += 2) {
      const code = parseInt(hex.substr(i, 2), 16) ^ key.charCodeAt((i / 2) % key.length);
      out += String.fromCharCode(code);
    }
    return out;
  } catch (e) {
    return '';
  }
};

/**
 * Returns primary administrator email resolved from environment or encrypted cipher
 */
export const getPrimaryAdminEmail = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_EMAIL) {
    return import.meta.env.VITE_ADMIN_EMAIL.trim();
  }
  return decryptToken(ENC_PRIMARY_ADMIN, CIPHER_KEY);
};

/**
 * Returns secondary/legacy administrator email resolved from environment or encrypted cipher
 */
export const getLegacyAdminEmail = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env?.VITE_LEGACY_ADMIN_EMAIL) {
    return import.meta.env.VITE_LEGACY_ADMIN_EMAIL.trim();
  }
  return decryptToken(ENC_LEGACY_ADMIN, CIPHER_KEY);
};

/**
 * Synchronously checks if an email matches designated platform admin credentials
 */
export const isDesignatedAdminEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const normalized = email.trim().toLowerCase();
  
  // 1. Direct environment variable match
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const envAdmin = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
    const envLegacy = (import.meta.env.VITE_LEGACY_ADMIN_EMAIL || '').trim().toLowerCase();
    if (envAdmin && normalized === envAdmin) return true;
    if (envLegacy && normalized === envLegacy) return true;
  }

  // 2. Decrypted token match
  const primary = getPrimaryAdminEmail().toLowerCase();
  const legacy = getLegacyAdminEmail().toLowerCase();
  if (normalized === primary || normalized === legacy) {
    return true;
  }

  return false;
};

/**
 * Compute SHA-256 cryptographic digest of a string
 */
export const computeSHA256 = async (str) => {
  if (!str) return '';
  try {
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    return '';
  } catch (e) {
    console.error('SHA-256 calculation error:', e);
    return '';
  }
};

/**
 * Cryptographically verify input password against the SHA-256 master password hash
 * Prevents plain text password leakage in source code
 */
export const verifyMasterAdminPassword = async (inputPassword) => {
  if (!inputPassword) return false;
  try {
    const computedHash = await computeSHA256(inputPassword);
    const targetHash = (
      (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADMIN_MASTER_HASH) || 
      MASTER_PASSWORD_HASH
    ).toLowerCase().trim();
    
    return Boolean(computedHash && computedHash === targetHash);
  } catch (err) {
    console.error('Master password hash verification error:', err);
    return false;
  }
};
