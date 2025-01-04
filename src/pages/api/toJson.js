import { parseStringToTree, createTreeState } from '../../lib/TreeData';

// todo: agregar validaciones de seguridad
export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const newickFile = req.body;
      console.log(newickFile);
      const pasedTree = createTreeState({
        name: 'DendrogramToJsonApi',
        tree: parseStringToTree(newickFile),
      });
      return res.status(200).json(pasedTree);
    }
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}
