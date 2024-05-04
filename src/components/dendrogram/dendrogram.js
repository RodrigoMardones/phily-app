import { useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import * as d3 from 'd3'

const MARGIN = { top: 200, right: 200, bottom: 200, left: 200, margin: 70 }

// se deja como funcion para poder generar dendrogramas de diferentes tamaños
const dendrogramGenerator = (width, height) =>
  d3.tree().nodeSize([width, height])

export default function Dendrogram({ data, width, height, type }) {
  const hierarchy = useMemo(() => {
    const HierarchyCreated = d3.hierarchy(data)
    // ascendencia o descendencia puede ser parametrizable
    HierarchyCreated.sort((a, b) => d3.descending(a.data.name, b.data.name))
    return HierarchyCreated
  }, [data])
  const dendrogram = useMemo(() => {
    const dendogramCreated = dendrogramGenerator(width, height)
    return dendogramCreated(hierarchy)
  }, [hierarchy, width, height])

  const allNodes = dendrogram.descendants().map((node) => {
    return (
      <g key={`node-${type}-${uuidv4()}`}>
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

  // forma de hacer una linea con curveStep
  // existen otras curvas que podrian ayudar a generar formas mas interesantes
  // revisar documentacion de d3 y ver el tema de la normalizacion de curva
  let direction = d3
    .line()
    .x((p) => p.x)
    .y((p) => p.y)
    .curve(d3.curveStep)

  const allEdges = dendrogram.descendants().map((node) => {
    if (!node.parent) {
      return null
    }
    // tengo que normalizar estos vectores para poder generar un dendrograma del mismo tamaño para todos los casos
    const step = [
      { x: node.parent.y, y: node.parent.x },
      { x: node.y, y: node.x },
    ]
    return (
      <path
        fill="none"
        stroke="#555"
        strokeOpacity={1}
        strokeWidth={2}
        key={`line-${node.id}-${uuidv4()}`}
        d={direction(step)} // revisar este campo para indicar formas geometricas
      />
    )
  })
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
