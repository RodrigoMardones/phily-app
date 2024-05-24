import { useSelector } from 'react-redux';
import { getTree } from '../store/tree/slice';
import { Card } from 'react-daisyui';
import Dendrogram from '../dendrogram/dendrogram';
import ZoomableSVG from '../zoomable/zoomable';
import { useState, useEffect, forwardRef } from 'react';

const Canvas = (props, ref) => {
  const [key, setKey] = useState(0);
  const { tree, normalize, curveType, name, angle, width, height } =
    useSelector(getTree);
  useEffect(() => {
    setKey(key + 1);
  }, [normalize, curveType, name, angle, angle, width, height]);

  return (
    <Card className="bg-white m-4 rounded-none border-none w-5/6">
      <div className="flex justify-center items-center h-full">
        <ZoomableSVG>
          {name && (
            <Dendrogram
              key={key}
              data={tree}
              // parte de las dimenciones base de dibujo de un arbol
              // calcular el ancho y alto de la imagen en base a la cantidad de nodos
              // y la cantidad de niveles
              width={width}
              height={height}
              normalize={normalize}
              curveType={curveType}
              angle={angle}
            />
          )}
        </ZoomableSVG>
      </div>
    </Card>
  );
};
const wrappedCanvas = forwardRef(Canvas);
export default wrappedCanvas;
