import * as d3 from 'd3'
import { useRef } from 'react'
import { useState, useEffect } from 'react'
export default function ZoomableSVG({ children, width, height }) {
  const svgRef = useRef()
  const [k, setK] = useState(1)
  const [x, setX] = useState(width)
  const [y, setY] = useState(height)
  useEffect(() => {
    const zoom = d3.zoom().on('zoom', (event) => {
      const { x, y, k } = event.transform
      setK(k)
      setX(x)
      setY(y)
    })
    d3.select(svgRef.current).call(zoom)
  }, [])
  return (
    <svg ref={svgRef} width={'100%'} height={'100%'}>
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  )
}
