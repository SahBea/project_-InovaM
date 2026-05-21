/**
 * Computes the SHA-256 hash of a string using the browser's native Web Crypto API.
 * @param {string} message - The plaintext password to hash.
 * @returns {Promise<string>} The hex string representation of the hash.
 */
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
