// TDA for tree data


/**
 * Create a new node style object
 * @param {object} options - the options object
 * @param {number} options.radius - the radius of the node
 * @param {string} options.stroke - the stroke color of the node
 * @param {string} options.fill - the fill color of the node
 * @returns {object} - the node style object
 */
export const createBaseNodeStyle = ({radius = 10, stroke = 'transparent', fill = '#69b3a2'}) => {
  return {
    radius: radius,
    stroke: stroke,
    fill: fill,
  }
}

/**
 * Create a new path style object
 * @param {object} options - the options object
 * @param {string} options.fill - the fill color of the path
 * @param {string} options.stroke - the stroke color of the path
 * @param {number} options.strokeOpacity - the stroke opacity of the path
 * @param {number} options.strokeWidth - the stroke width of the path
 * @returns {object} - the path style object
 */
export const createBasePathStyle = ({fill = 'none', stroke = '#000000', strokeOpacity = 1, strokeWidth = 2}) => {
  return {
    fill: fill,
    stroke: stroke,
    strokeOpacity: strokeOpacity,
    strokeWidth: strokeWidth,
  }
}

/**
 * Create a new label style object
 * @param {object} options - the options object
 * @param {boolean} options.hidden - whether the label is hidden
 * @param {number} options.fontSize - the font size of the label
 * @returns {object} - the label style object
 */
export const createBaseLabelStyle = ({hidden = false, fontSize = 48, fill ='#000000' }) => {
  return {
    hidden: hidden,
    fontSize: fontSize,
    fill: fill,
  }
}

/**
 * Create a new global styles object
 * @param {object} options - the options object
 * @param {object} options.labelStyle - the label style object
 * @param {object} options.nodeStyle - the node style object
 * @param {object} options.pathStyle - the path style object
 * @returns {object} - the global styles object
 */
export const createBaseGlobalStyles = ({labelStyle = createBaseLabelStyle({}), nodeStyle = createBaseNodeStyle({}), pathStyle = createBasePathStyle({})}) => {
  return {
    labelStyle: labelStyle,
    nodeStyle: nodeStyle,
    pathStyle: pathStyle,
  }
}
/**
 * Create a new tree object
 * @returns {object} - the tree object
 */
export const createBaseTree = () => {
  return {
    name: '',
    length: '',
    hasOwnStyle: false,
    nodeStyle: createBaseNodeStyle({}),
    pathStyle : createBasePathStyle({}),
    labelStyle : createBaseLabelStyle({}),
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

export const getDepth = function (obj) {
  var depth = 0;
  if(!obj?.children) {
      return 1
  }
  if (obj.children) {
      obj.children.forEach(function (d) {
          var tmpDepth = getDepth(d)
          if (tmpDepth > depth) {
              depth = tmpDepth
          }
      })
  }
  return 1 + depth
}

/**
 * Modify the node style of a tree object
 * @param {object} obj - the tree object
 * @param {object} nodeStyle - the node style object
 * @returns {undefined}
 */
export const modifyNodeStyle = function (obj, nodeStyle) {
  obj.nodeStyle = nodeStyle
  if (obj.children) {
    obj.children.forEach(function (d) {
      modifyNodeStyle(d, nodeStyle)
    })
  }
}

/**
 * Modify the path style of a tree object
 * @param {object} obj - the tree object
 * @param {object} pathStyle - the path style object
 * @returns {undefined}
 */
export const modifyPathStyle = function (obj, pathStyle) {
  obj.pathStyle = pathStyle
  if (obj.children) {
    obj.children.forEach(function (d) {
      modifyPathStyle(d, pathStyle)
    })
  }
}

/**
 * Modify the label style of a tree object
 * @param {object} obj - the tree object
 * @param {object} labelStyle - the label style object
 * @returns {undefined}
 */
export const modifyLabelStyle = function (obj, labelStyle) {
  obj.labelStyle = labelStyle
  if (obj.children) {
    obj.children.forEach(function (d) {
      modifyLabelStyle(d, labelStyle)
    })
  }
}

/**
 * Modify the node style of a specific node in a tree object
 * @param {object} obj - the tree object
 * @param {object} nodeStyle - the node style object
 * @param {string} node - the name of the node
 */
export const modifyEspecificNodeStyle = function (obj, nodeStyle, node) {
  if (obj.name === node) {
    obj.nodeStyle = nodeStyle
  }
  if (obj.children) {
    obj.children.forEach(function (d) {
      modifyEspecificNodeStyle(d, nodeStyle, node)
    })
  }
}

/**
 * Modify the path style of a specific node in a tree object
 * @param {object} obj - the tree object
 * @param {object} pathStyle - the path style object
 * @param {string} node - the name of the node
 * @returns {undefined}
 */
export const modifyEspecificPathStyle = function (obj, pathStyle, node) {
  if (obj.name === node) {
    obj.pathStyle = pathStyle
  }
  if (obj.children) {
    obj.children.forEach(function (d) {
      modifyEspecificPathStyle(d, pathStyle, node)
    })
  }
}

/**
 * Modify the label style of a specific node in a tree object
 * @param {object} obj - the tree object
 * @param {object} labelStyle - the label style object
 * @param {string} node - the name of the node
 * @returns {undefined}
 */
export const modifyEspecificLabelStyle = function (obj, labelStyle, node) {
  if (obj.name === node) {
    obj.labelStyle = labelStyle
  }
  if (obj.children) {
    obj.children.forEach(function (d) {
      modifyEspecificLabelStyle(d, labelStyle, node)
    })
  }
}
