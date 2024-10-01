import { useSelector } from 'react-redux';
import { getTree } from '../store/tree/slice';
import { Card } from 'react-daisyui';
import Dendrogram from '../dendrogram/dendrogram';
import ZoomableSVG from './hooks/zoomable';
import { useState, useEffect, useRef } from 'react';
import useZoom from './hooks/useZoom';
import ZoomAddIcon from '../icons/zoomAdd';
import ZoomSubsIcon from '../icons/zoomSubs';
import useDendrogramForm from '../dashboard/hooks/useDendrogramForm';
import useStyle from '../dashboard/hooks/useStyle';
import useSubMenu from '../submenu/useSubmenu';
import SubMenu from '../submenu/submenu';
const Canvas = () => {
  const ref = useRef(null);
  const [key, setKey] = useState(0);
  const { deferredAngle, deferredCurveType, deferredNormalize } =
    useDendrogramForm();
  const { deferredGlobalStyle } = useStyle();
  const { tree, name, width, height } = useSelector(getTree);
  const { handleAddZoomClick, handleSubstractZoomClick } = useZoom();
  const { contextMenu, handleClose } = useSubMenu();
  useEffect(() => {
    setKey((key) => key + 1);
  }, [
    deferredNormalize,
    deferredCurveType,
    deferredAngle,
    name,
    width,
    height,
    deferredGlobalStyle,
  ]);

  return (
    <Card className="bg-white m-4 rounded-none border-none w-5/6">
      <div className="flex justify-center h-full relative">
        <button
          className=" bg-transparent absolute top-0 right-0 m-2"
          onClick={handleAddZoomClick}
          disabled={!name}
        >
          <ZoomAddIcon />
        </button>
        <button
          className=" bg-transparent absolute top-6 right-0 m-2"
          onClick={handleSubstractZoomClick}
          disabled={!name}
        >
          <ZoomSubsIcon />
        </button>
        <SubMenu />
        <div className="item h-full w-full relative" ref={ref}>
          <ZoomableSVG width={width} height={height}>
            {name && (
              <Dendrogram
                key={key}
                data={tree}
                width={width}
                height={height}
                normalize={deferredNormalize}
                curveType={deferredCurveType}
                angle={deferredAngle}
                globalStyles={deferredGlobalStyle}
              />
            )}
          </ZoomableSVG>
        </div>
      </div>
    </Card>
  );
};

export default Canvas;
