import { useSelector } from 'react-redux';
import { getTree } from '../store/tree/slice';
import { Card } from 'react-daisyui';
import Dendrogram from '../dendrogram/dendrogram';
import ZoomableSVG from './hooks/zoomable';
import { useState, useEffect } from 'react';
import useZoom from './hooks/useZoom';
import ZoomAddIcon from '../icons/zoomAdd';
import ZoomSubsIcon from '../icons/zoomSubs';

const Canvas = () => {
  const [key, setKey] = useState(0);
  const { tree, normalize, curveType, name, angle, width, height, globalStyles } =
    useSelector(getTree);
  const { handleAddZoomClick, handleSubstractZoomClick } = useZoom();
  useEffect(() => {
    setKey(key + 1);
  }, [normalize, curveType, name, angle, angle, width, height]);
  return (
    <Card className="bg-white m-4 rounded-none border-none w-5/6">
      <div className="flex justify-center h-full">
        <div className="item h-full w-full z-0" id="dendrogram">
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
                globalStyles={globalStyles}
              />
            )}
          </ZoomableSVG>
        </div>
        <div className="items-end z-10 mt-2 mb-2">
          <button
            className=" bg-transparent"
            onClick={handleAddZoomClick}
            disabled={!name}
          >
            <ZoomAddIcon />
          </button>
          <button
            className=" bg-transparent"
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
