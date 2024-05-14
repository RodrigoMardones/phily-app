import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as d3 from 'd3'
import CircularDendrogram from './circularDendrogram'

const MARGIN = { top: 200, right: 200, bottom: 200, left: 200, margin: 70 }

const degToRad = (deg) => {
  return (deg * 2 * Math.PI) / 360
}
// se deja como funcion para poder generar dendrogramas de diferentes tamaños
const dendrogramGenerator = (width, height, normalize, curveType = null) => {
  return normalize
    ? d3.cluster().size([height, width])
    : d3.tree().size([height, width])
}

const drawCurve = (curveType) => {
  switch (curveType) {
    case 'step':
      return d3.link(d3.curveStep)
    case 'curve':
      return d3.link(d3.curveBumpX)
    case 'slanted':
      return d3.link(d3.curveLinear)
  }
}

export default function Dendrogram({
  data,
  width,
  height,
  normalize,
  curveType,
}) {
  if(curveType ==="circular"){
    return <CircularDendrogram data={data} width={width} height={height} normalize={normalize} curveType={curveType} />
  }
  const hierarchy = useMemo(() => {
    const HierarchyCreated = d3.hierarchy(data)
    HierarchyCreated.sort((a, b) => d3.ascending(a.data.name, b.data.name))
    return HierarchyCreated
  }, [data])
  const dendrogram = useMemo(() => {
    const dendogramCreated = dendrogramGenerator(width, height, normalize)
    return dendogramCreated(hierarchy)
  }, [hierarchy, width, height, normalize, curveType])
  let curve = drawCurve(curveType)

  const allNodes = dendrogram.descendants().map((node) => {
    return (
      <g key={`node-${uuidv4()}`}>
        <circle
          cx={node.y}
          cy={node.x}
          r={20}
          stroke="transparent"
          fill={'#69b3a2'}
        />
        <text
          x={node.y + 30}
          y={node.x}
          fontSize={48}
          textAnchor={node.children ? 'end' : 'start'}
          alignmentBaseline="central"
        >
          {node.data.name}
        </text>
      </g>
    )
  })

  const allEdges = dendrogram.descendants().map((node) => {
    if (!node.parent) {
      return null
    }
    return (
      <path
        fill="none"
        stroke="#555"
        strokeOpacity={1}
        strokeWidth={2}
        key={`line-${node.id}-${uuidv4()}`}
        d={curve({
          source: [node.parent.y, node.parent.x],
          target: [node.y, node.x],
        })}
      />
    )
  })
  
  return (
    <g
      transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
    >
      {allEdges}
      {allNodes}
    </g>
  )
}
