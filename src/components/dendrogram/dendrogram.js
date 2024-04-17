import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'

const MARGIN = { top: 200, right: 200, bottom: 200, left: 200, margin: 70 }
const actualDirection = (type, node) => {
  let actualpos = {
    x: 0,
    y: 0,
  }
  switch (type) {
    case 'vertical':
      actualpos.x = node.x
      actualpos.y = node.y
      return actualpos
    case 'horizontal':
      actualpos.x = node.y
      actualpos.y = node.x
      return actualpos
    default:
      actualpos.x = node.y
      actualpos.y = node.x
      return actualpos
  }
}

export default function Dendrogram({ data, width, height, type }) {
  const hierarchy = useMemo(() => {
    return d3.hierarchy(data)
  }, [data])
  const dendrogram = useMemo(() => {
    const dendrogramGenerator = d3.tree().nodeSize([width, height])
    hierarchy.sort((a, b) => d3.ascending(a.data.name, b.data.name))
    return dendrogramGenerator(hierarchy)
  }, [hierarchy, width, height])

  const allNodes = dendrogram.descendants().map((node) => {
    const actualpos = actualDirection(type, node)
    return (
      <g key={`node-${type}-${uuidv4()}`}>
        <circle
          cx={actualpos.x}
          cy={actualpos.y}
          r={5}
          stroke="transparent"
          fill={'#69b3a2'}
        />
        <text
          x={actualpos.x}
          y={actualpos.y}
          fontSize={12}
          textAnchor={node.children ? 'end' : 'start'}
          alignmentBaseline="central"
          transform={type === 'vertical' ? 'translate(0,20)' : ''}
        >
          {node.data.name}
        </text>
      </g>
    )
  })

  let direction
  if (type === 'horizontal') {
    direction = d3.linkHorizontal()
  }
  if (type === 'vertical') {
    direction = d3.linkVertical()
  }
  const allEdges = dendrogram.descendants().map((node) => {
    if (!node.parent) {
      return null
    }
    let LinkObject
    if (type === 'horizontal') {
      LinkObject = {
        source: [node.parent.y, node.parent.x],
        target: [node.y, node.x],
      }
    }
    if (type === 'vertical') {
      LinkObject = {
        source: [node.parent.x, node.parent.y],
        target: [node.x, node.y],
      }
    }
    return (
      <path
        fill="none"
        stroke="#555"
        strokeOpacity={0.4}
        strokeWidth={1.5}
        key={`line-${node.id}-${uuidv4()}`}
        d={direction(LinkObject)}
      />
    )
  })
  return (
    <g
      className="w-full h-full"
      transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
    >
      {allNodes}
      {allEdges}
    </g>
  )
}
