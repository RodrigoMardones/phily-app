import { useSelector } from 'react-redux';
import { getTree } from '../store/tree/slice';
import { Card } from 'react-daisyui';
import Dendrogram from '../dendrogram/dendrogram';
import ZoomableSVG from '../zoomable/zoomable';
import { useState, useEffect } from 'react';
import useZoom from './hooks/useZoom';
import ZoomAddIcon from '../icons/zoomAdd';
import ZoomSubsIcon from '../icons/zoomSubs';

const Canvas = () => {
  const [key, setKey] = useState(0);
  const { tree, normalize, curveType, name, angle, width, height } =
    useSelector(getTree);
  const { handleAddZoomClick, handleSubstractZoomClick } = useZoom();
  useEffect(() => {
    setKey(key + 1);
  }, [normalize, curveType, name, angle, angle, width, height]);

  return (
    <Card className="w-5/6 m-4 bg-white border-none rounded-none">
      <div className="flex justify-center h-full">
        <div className="z-0 w-full h-full item" id="dendrogram">
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
              />
            )}
          </ZoomableSVG>
        </div>
        <div className="z-10 items-end mt-2 mb-2">
          <button
            className="bg-transparent "
            onClick={handleAddZoomClick}
            disabled={!name}
          >
            <ZoomAddIcon />
          </button>
          <button
            className="bg-transparent "
            onClick={handleSubstractZoomClick}
            disabled={!name}
          >
            <ZoomSubsIcon />
          </button>
        </div>
      </div>
    </Card>
  );
};

export default Canvas;
