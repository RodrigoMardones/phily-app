import { useCallback, useMemo } from 'react'
import * as d3 from 'd3'
import { dendrogramGenerator, drawCurve, transformSVG, MARGIN } from './utils'


export default function Dendrogram({
  data,
  width,
  height,
  normalize,
  curveType,
  angle
}) {
  const hierarchy = useMemo(() => {
    const HierarchyCreated = d3.hierarchy(data)
    HierarchyCreated.sort((a, b) => d3.ascending(a.data.name, b.data.name))
    return HierarchyCreated
  }, [data])

  const radius = useMemo(() => {
    return Math.min(width, height) / 2 - MARGIN
  }, [width, height])

  const[curve, transform] = useMemo(() => {
    return [drawCurve(curveType), transformSVG(curveType, radius)]
  }, [curveType, radius])	

  const dendrogram = useMemo(() => {
    const dendogramCreated = dendrogramGenerator(width, height, normalize, curveType, angle)
    return dendogramCreated(hierarchy)
  }, [hierarchy, width, height, normalize, curveType, angle])
  
  // podria separar esto en otros componentes
  const renderNode = useCallback(
    (node, nodeIndex) => {
      if (curveType === 'circular' || curveType === 'circular-step') {
        const turnLabelUpsideDown = node.x > 180
        return (
          <g
            key={`node-${nodeIndex}`}
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
      }

      return (
        <g key={`node-${nodeIndex}`}>
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
    },
    [normalize, curveType]
  )

  const renderEdges = useCallback(
    (link,indexLink) => {
      if (curveType === 'circular' || curveType === 'circular-step') {
        if (link?.source?.depth === 0) {
          return (
            <g
              key={`link-${indexLink}`}
              transform={'rotate(' + (link.target.x - 90) + ')'}
            >
              <line x1={0} y1={0} x2={link.target.y} y2={0} stroke="grey" />;
            </g>
          )
        }
        return (
          <path
            key={`link-${indexLink}`}
            fill="none"
            stroke="#555"
            d={curve(link) || undefined}
          />
        )
      } else {
        if (!link.source) {
          return null
        }
        return (
          <path
            fill="none"
            stroke="#555"
            strokeOpacity={1}
            strokeWidth={2}
            key={`link-${indexLink}`}
            d={curve({
              source: [link.source.y, link.source.x],
              target: [link.target.y, link.target.x],
            })}
          />
        )
      }
    },
    [normalize, curveType]
  )

  const allNodes = dendrogram.descendants().map(renderNode)
  const allEdges = dendrogram.links().map(renderEdges)

  
  return (
    <g transform={transform}>
      {allEdges}
      {allNodes}
    </g>
  )
}
