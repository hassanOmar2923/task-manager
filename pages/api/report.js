import db from '@/lib/database';

export default function handler(req, res) {
  const { method } = req;

  if (method === 'POST') {
    const { id } = req.body;
    try {
      const query = db.prepare('SELECT * FROM registration6 WHERE id = ?').get(id);
      res.status(200).json({ status: true, data: query });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Error fetching report data' });
    }
  } else if (method === 'GET') {
    try {
      const query = db.prepare('SELECT id, name FROM registration4').all();
      res.status(200).json({ status: true, data: query });
    } catch (error) {
      console.error('Database error:', error);
      res.status(500).json({ error: 'Error fetching report data' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
