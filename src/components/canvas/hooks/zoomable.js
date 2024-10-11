import * as d3 from 'd3';
import { useRef } from 'react';
import { useState, useEffect } from 'react';
import useSubMenu from '../../submenu/useSubmenu';

export default function ZoomableSVG({ children, width, height }) {
  const svgRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(width);
  const [y, setY] = useState(height);
  const { handleClose } = useSubMenu();

  useEffect(() => {
    const zoom = d3.zoom().on('zoom', (event) => {
      const { x, y, k } = event.transform;
      setX(x);
      setY(y);
      setK(k);
    });
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg ref={svgRef} width={'100%'} height={'100%'} onClick={handleClose}>
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
    </svg>
  );
}
