import { parseStringToTree, createTreeState } from '../../lib/TreeData';

const MAX_NEWICK_LENGTH = 1_000_000; // 1MB de texto Newick como tope defensivo

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const newickFile = req.body;

  if (typeof newickFile !== 'string' || newickFile.trim() === '') {
    return res
      .status(400)
      .json({ message: 'El cuerpo debe ser una cadena Newick no vacía' });
  }

  if (newickFile.length > MAX_NEWICK_LENGTH) {
    return res
      .status(413)
      .json({ message: 'El contenido Newick excede el tamaño permitido' });
  }

  try {
    const pasedTree = createTreeState({
      name: 'DendrogramToJsonApi',
      tree: parseStringToTree(newickFile),
    });
    return res.status(200).json(pasedTree);
  } catch (e) {
    return res
      .status(400)
      .json({ message: 'El contenido Newick no tiene un formato válido' });
  }
}
