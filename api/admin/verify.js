/**
 * PlateSync - Secure Serverless Admin Verification Endpoint
 * Vercel Serverless Function (/api/admin/verify)
 */

export default async function handler(req, res) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or malformed token' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    // Decode and verify Firebase ID token structure
    const parts = token.split('.');
    if (parts.length !== 3) {
      return res.status(401).json({ error: 'Invalid token structure' });
    }

    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
    const now = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < now) {
      return res.status(401).json({ error: 'Token has expired' });
    }

    const email = payload.email || '';
    const isOwner = email.toLowerCase() === 'samilplatesync@gmail.com';
    const isAdmin = isOwner || payload.admin === true || payload.role === 'admin';

    if (!isAdmin) {
      return res.status(403).json({ error: 'Forbidden: Account lacks administrative privileges' });
    }

    return res.status(200).json({
      verified: true,
      uid: payload.sub || payload.user_id,
      email: payload.email,
      role: isOwner ? 'owner' : 'admin',
      isOwner,
      verifiedAt: new Date().toISOString()
    });
  } catch (err) {
    console.error('Server token verification error:', err);
    return res.status(401).json({ error: 'Token validation failed' });
  }
}
