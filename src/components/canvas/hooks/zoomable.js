import { zoom, select, zoomIdentity } from 'd3';
import { useRef } from 'react';
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSubMenu from '../../submenu/useSubmenu';
import { getFindNodeName, clearFindNodeName, setHighlightedNodeName, clearHighlightedNodeName } from '../../store/dashboard/slice';
import { getZoom, setZoom } from '../../store/tree/slice';
import { clearSelection } from '../../store/selection/slice';
import useRubberBand from './useRubberBand';
import palette from '@/styles/palette';

export default function ZoomableSVG({ children, width, height, treeName }) {
  const svgRef = useRef();
  const zoomRef = useRef();
  const saveTimerRef = useRef();
  const [k, setK] = useState(1);
  const [x, setX] = useState(width);
  const [y, setY] = useState(height);
  const { handleClose } = useSubMenu();
  const findNodeName = useSelector(getFindNodeName);
  const savedZoom = useSelector(getZoom);
  const dispatch = useDispatch();
  const { rect: rubberBandRect, handleRubberBandStart } = useRubberBand(svgRef);

  const saveZoom = useCallback((transform) => {
    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      dispatch(setZoom({ x: transform.x, y: transform.y, k: transform.k }));
    }, 500);
  }, [dispatch]);

  useEffect(() => {
    const svg = select(svgRef.current);
    const zoomed = zoom()
      .filter((event) => !event.altKey && (!event.ctrlKey || event.type === 'wheel') && !event.button)
      .on('zoom', (event) => {
      const { x, y, k } = event.transform;
      setX(x);
      setY(y);
      setK(k);
      saveZoom(event.transform);
    });
    zoomRef.current = zoomed;
    svg.call(zoomed);
    return () => {
      svg.on('.zoom', null);
      clearTimeout(saveTimerRef.current);
    };
  }, [saveZoom]);

  useEffect(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const svgEl = svgRef.current;

    if (savedZoom) {
      const restoredTransform = zoomIdentity.translate(savedZoom.x, savedZoom.y).scale(savedZoom.k);
      select(svgEl).call(zoomRef.current.transform, restoredTransform);
    } else {
      const svgRect = svgEl.getBoundingClientRect();
      const centerX = (svgRect.width - width) / 2;
      const centerY = (svgRect.height - height) / 2;
      const newTransform = zoomIdentity.translate(centerX, centerY);
      select(svgEl).call(zoomRef.current.transform, newTransform);
    }
  }, [width, height, treeName]);

  useEffect(() => {
    if (!findNodeName || !svgRef.current) return;
    const svg = svgRef.current;
    const labels = svg.querySelectorAll('.label');
    let target = null;
    for (const label of labels) {
      if (label.textContent === findNodeName) {
        target = label;
        break;
      }
    }
    if (!target || !zoomRef.current) {
      dispatch(clearFindNodeName());
      return;
    }
    const svgRect = svg.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const centerX = svgRect.width / 2;
    const centerY = svgRect.height / 2;
    const targetCenterX = targetRect.left - svgRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top - svgRect.top + targetRect.height / 2;
    const newX = x + (centerX - targetCenterX);
    const newY = y + (centerY - targetCenterY);
    const newTransform = zoomIdentity.translate(newX, newY).scale(k);
    select(svg).transition().duration(500).call(zoomRef.current.transform, newTransform);
    dispatch(setHighlightedNodeName(findNodeName));
    dispatch(clearFindNodeName());
  }, [findNodeName, dispatch, x, y, k]);

  const handleCanvasClick = useCallback((e) => {
    handleClose();
    dispatch(clearHighlightedNodeName());
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      dispatch(clearSelection());
    }
  }, [handleClose, dispatch]);

  return (
    <svg
      ref={svgRef}
      width={'100%'}
      height={'100%'}
      onClick={handleCanvasClick}
      onMouseDown={handleRubberBandStart}
      style={rubberBandRect ? { cursor: 'crosshair' } : undefined}
    >
      <g transform={`translate(${x},${y})scale(${k})`}>{children}</g>
      {rubberBandRect && (
        <rect
          x={rubberBandRect.x}
          y={rubberBandRect.y}
          width={rubberBandRect.width}
          height={rubberBandRect.height}
          fill={palette.signal}
          fillOpacity={0.15}
          stroke={palette.signal}
          strokeWidth={1}
          strokeDasharray="4 2"
          pointerEvents="none"
        />
      )}
    </svg>
  );
}
