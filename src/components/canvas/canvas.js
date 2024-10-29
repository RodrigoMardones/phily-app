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
import SubMenu from '../submenu/submenu';
import { useBurgerMenu } from '../dashboard/hooks';

const Canvas = () => {
  const contextRef = useRef(null);
  const [key, setKey] = useState(0);
  const { deferredAngle, deferredCurveType, deferredNormalize } =
    useDendrogramForm();
  const { deferredGlobalStyle } = useStyle();
  const { tree, name, width, height } = useSelector(getTree);
  const { handleAddZoomClick, handleSubstractZoomClick } = useZoom();
  const { isOpen } = useBurgerMenu();
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
    <Card
      className={
        isOpen
          ? `bg-white m-4 rounded-md border-none w-full`
          : ` bg-white m-4 rounded-md border-none w-5/6`
      }
    >
      <div className="flex justify-center h-full">
        <button
          className=" bg-transparent absolute top-0 right-0 m-2"
          id='zoomIn'
          onClick={handleAddZoomClick}
          disabled={!name}
        >
          <ZoomAddIcon />
        </button>
        <button
          className=" bg-transparent absolute top-6 right-0 m-2"
          id='zoomOut'
          onClick={handleSubstractZoomClick}
          disabled={!name}
        >
          <ZoomSubsIcon />
        </button>

        <div className="item h-full w-full" ref={contextRef} id="canvas">
          <SubMenu />
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
