
import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    // In a real app we'd use JWT, but for this context 
    // we use the actual password as a secret token since it's only known by the admin
    return res.status(200).json({ token: password });
  }

  return res.status(401).json({ error: 'Invalid password' });
}
