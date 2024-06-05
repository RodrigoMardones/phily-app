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
    <Card className="w-5/6 m-4 bg-white border-none rounded-none" id='treeSvg'>
      <div className="flex items-center justify-center h-full">
        <ZoomableSVG>
          {name && (
            <Dendrogram
              key={key}
              data={tree}
              width={width}
              height={height}
              normalize={normalize}
              curveType={curveType}
              angle={angle}
              ref={ref}
            />
          )}
        </ZoomableSVG>
      </div>
    </Card>
  );
};
const wrappedCanvas = forwardRef(Canvas);
export default wrappedCanvas;
