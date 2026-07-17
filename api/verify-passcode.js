export default async function handler(req, res) {
  // Allow CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { passcode } = req.body;
  const adminPasscode = process.env.ADMIN_PASSCODE || '1234';

  if (passcode && String(passcode) === String(adminPasscode)) {
    return res.status(200).json({ success: true, message: 'Passcode verified successfully' });
  }

  return res.status(401).json({ success: false, error: 'Invalid admin passcode' });
}
