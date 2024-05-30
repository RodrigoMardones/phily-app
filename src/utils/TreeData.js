
/**
 * Create a new tree object
 * @returns {object} - the tree object
 */
export const createBaseTree = () => {
  return {
    name: '',
    nodeStyle: {
      radius: 10,
      stroke: 'transparent',
      fill: '#69b3a2',
    },
    pathStyle : {
      fill: 'none',
      stroke: '#555',
      strokeOpacity: 1,
      strokeWidth: 2,
    },
    textStyle : {
      fontSize: 48,
    },
    children: [],
  }
}

/**
 * Parse a string into a tree object
 * @param {string} s - the string to parse
 * @returns {object} - the tree object
 */
export const parseStringToTree = (s) => {
  const ancestors = []
  let tree = createBaseTree()
  const tokens = s.split(/\s*([;(),:])\s*/)
  let subtree

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]

    switch (token) {
      case '(': // new children
        subtree = createBaseTree()
        tree.children = [subtree]
        ancestors.push(tree)
        tree = subtree
        break
      case ',': // another branch
        subtree = createBaseTree()
        ancestors[ancestors.length - 1].children.push(subtree)
        tree = subtree
        break
      case ')': // optional name next
        tree = ancestors.pop()
        break
      case ':': // optional length next
        break
      default:
        const x = tokens[i - 1]

        if (x === ')' || x === '(' || x === ',') {
          tree.name = token
        } else if (x === ':') {
          tree.length = String(token)
        }
    }
  }
  return tree
}
