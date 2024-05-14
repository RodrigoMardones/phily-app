import { useMemo, useCallback } from 'react'
import * as d3 from 'd3'

const MARGIN = 70

const degToRad = (deg) => {
  return (deg * 2 * Math.PI) / 360
}
// funcion para dejar escalonado
function linkStep(startAngle, startRadius, endAngle, endRadius) {
  var c0 = Math.cos((startAngle = ((startAngle - 90) / 180) * Math.PI)),
    s0 = Math.sin(startAngle),
    c1 = Math.cos((endAngle = ((endAngle - 90) / 180) * Math.PI)),
    s1 = Math.sin(endAngle);
  return (
    "M" +
    startRadius * c0 +
    "," +
    startRadius * s0 +
    (endAngle === startAngle
      ? ""
      : "A" +
        startRadius +
        "," +
        startRadius +
        " 0 0 " +
        (endAngle > startAngle ? 1 : 0) +
        " " +
        startRadius * c1 +
        "," +
        startRadius * s1) +
    "L" +
    endRadius * c1 +
    "," +
    endRadius * s1
  );
}

function linkConstant(d) {
  return linkStep(d.source.x, d.source.y, d.target.x, d.target.y);
}

export const CircularDendrogram = ({ width, height, data }) => {
  const hierarchy = useMemo(() => {
    return d3.hierarchy(data).sum((d) => d.value)
  }, [data])

  const radius = Math.min(width, height) / 2 - MARGIN

  const dendrogram = useMemo(() => {
    const dendrogramGenerator = d3.tree().size([360, radius])
    return dendrogramGenerator(hierarchy)
  }, [hierarchy, width, height])

  const renderNode = useCallback((node) => {
    const turnLabelUpsideDown = node.x > 180
    return (
      <g
        key={`node-${node.data.id}`}
        transform={`rotate(${node.x - 90})translate(${node.y})`}
      >
        <circle cx={0} cy={0} r={10} stroke="transparent" fill="#69b3a2" />
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
  }, [])
  const linksGenerator = d3
    .linkRadial()
    .angle((node) => degToRad(node.x))
    .radius((node) => node.y)
  const renderEdges = useCallback((link) => {
    if (link.source.depth === 0) {
      return (
        <g
          key={link.source + '_' + link.target}
          transform={'rotate(' + (link.target.x - 90) + ')'}
        >
          <line x1={0} y1={0} x2={link.target.y} y2={0} stroke="grey" />;
        </g>
      )
    }
    return (
      <path
        key={link.source + '_' + link.target}
        fill="none"
        stroke="#555"
        d={linkConstant(link) || undefined}
      />
    )
  }, [])
  const allNodes = dendrogram.descendants().map(renderNode)
  const allEdges = dendrogram.links().map(renderEdges)

  return (
    <g
      transform={
        'translate(' + (radius + MARGIN / 2) + ',' + (radius + MARGIN / 2) + ')'
      }
    >
      {allEdges}
      {allNodes}
    </g>
  )
}
export default CircularDendrogram
