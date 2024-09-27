import * as d3 from 'd3';
import { useRef } from 'react';
import { useState, useEffect } from 'react';

export default function ZoomableSVG({ children, width, height}) {
  const svgRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(width);
  const [y, setY] = useState(height);

  useEffect(() => {
    const zoom = d3.zoom()
    .on('zoom', (event) => {
      const { x, y, k } = event.transform;
      // valores de x, y, k, height, width, sizes
      // console.log({ x, y, k, height, width });
      // x y k son los valores donde se posiciona el centro del dibujo
      // width y height son el ancho y alto del dibujo original
      // sizes son el ancho y alto del contenedor

      // si x se aproxima a el width del contenedor quiere decir que se aproxima al borde derecho del contenedor
      // si x

      setX(x);
      setY(y);
      setK(k);
    })
    d3.select(svgRef.current).call(zoom);
  }, []);
  return (
    <svg ref={svgRef} width={'100%'} height={'100%'} id='dendrogram-svg'>
      <g 
        transform={`translate(${x},${y})scale(${k})`}
        >{children}</g>
    </svg>
  );
}
