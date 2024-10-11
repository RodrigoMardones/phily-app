// /home/try0wasp/proyectos/phily-app/src/pages/api/example.js
import { promises as fs } from 'fs';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const tree = await fs.readFile(process.cwd() + '/examples/newExample3.json', 'utf8');
    const treeObj = JSON.parse(tree);
    res.status(200).json(treeObj);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
