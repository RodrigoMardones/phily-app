import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as d3 from 'd3'

const MARGIN = { top: 200, right: 200, bottom: 200, left: 200, margin: 70 }

const degToRad = (deg) => {
  return (deg * 2 * Math.PI) / 360
}
// se deja como funcion para poder generar dendrogramas de diferentes tamaños
const dendrogramGenerator = (width, height, normalize, curveType = null) => {
  const radius = Math.min(width, height) / 2 - MARGIN.margin
  if (curveType === 'circular') {
    d3.cluster().size([360, radius])
  }
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
    case 'circular':
      return d3
        .linkRadial()
        .angle((d) => degToRad(d.x))
        .radius((d) => d.y)
  }
}

export default function Dendrogram({
  data,
  width,
  height,
  normalize,
  curveType,
}) {
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
  const radius = Math.min(width, height) / 2 - MARGIN.margin

  const allNodes = dendrogram.descendants().map((node) => {
    const turnLabelUpsideDown = node.x > 180

    if (curveType === 'circular') {
      return (
        <g
          key={`node-circular-${uuidv4()}`}
          transform={'rotate(' + (node.x - 90) + ')translate(' + node.y + ')'}
        >
          <circle cx={0} cy={0} r={5} stroke="transparent" fill={'#69b3a2'} />
          {!node.children && (
            <text
              x={turnLabelUpsideDown ? -15 : 15}
              y={0}
              fontSize={12}
              textAnchor={turnLabelUpsideDown ? 'end' : 'start'}
              transform={turnLabelUpsideDown ? 'rotate(180)' : 'rotate(0)'}
              alignmentBaseline="middle"
            >
              {node.data.name}
            </text>
          )}
        </g>
      )
    }
    return (
      <g key={`node-${uuidv4()}`}>
        <circle
          cx={node.y}
          cy={node.x}
          r={20}
          stroke="transparent"
          fill={'#69b3a2'}
          d={(d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`}
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
    if (curveType === 'circular' && !node.parent) {
      return null
    }
    if (curveType === 'circular') {
      if (node.depth === 0) {
        return (
          <g
            key={`line-circular-${uuidv4()}`}
            transform={'rotate(' + (node.target.x - 90) + ')'}
          >
            <line x1={0} y1={0} x2={node.target.y} y2={0} stroke="grey" />;
          </g>
        )
      }
      return (
        <path
          key={`line-circular-${uuidv4()}`}
          fill="none"
          stroke="grey"
          d={drawCurve(node)}
        />
      )
    }
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
  if (curveType === 'circular') {
    <g
      transform={
        'translate(' + (radius + MARGIN.margin / 2) + ',' + (radius + MARGIN.margin / 2) + ')'
      }
    >
      {allEdges}
      {allNodes}
    </g>
  }
  return (
    <g
      className="w-full h-full"
      transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
    >
      {allEdges}
      {allNodes}
    </g>
  )
}
