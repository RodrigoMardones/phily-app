import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as d3 from 'd3'

const MARGIN = { top: 200, right: 200, bottom: 200, left: 200, margin: 70 }

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
    return (
      <g key={`node-${type}-${uuidv4()}`}>
        <circle
          cx={node.y}
          cy={node.x}
          r={5}
          stroke="transparent"
          fill={'#69b3a2'}
        />
        <text
          x={node.y}
          y={node.x}
          fontSize={24}
          textAnchor={node.children ? 'end' : 'start'}
          alignmentBaseline="central"
        >
          {node.data.name}
        </text>
      </g>
    )
  })

  let direction = d3.linkHorizontal();

  const allEdges = dendrogram.descendants().map((node) => {
    if (!node.parent) {
      return null
    }
    let LinkObject = {
        source: [node.parent.y, node.parent.x],
        target: [node.y, node.x],
    }
    return (
      <path
        fill="none"
        stroke="#555"
        strokeOpacity={1}
        strokeWidth={2}
        key={`line-${node.id}-${uuidv4()}`}
        d={direction(LinkObject)} // revisar este campo para indicar formas geometricas
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
