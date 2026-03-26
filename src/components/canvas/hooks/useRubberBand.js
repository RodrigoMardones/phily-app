import { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { addIds } from '../../store/selection/slice';

export default function useRubberBand(svgRef) {
  const dispatch = useDispatch();
  const [rect, setRect] = useState(null);
  const startRef = useRef(null);
  const rectRef = useRef(null);

  const toSVGCoords = useCallback(
    (clientX, clientY) => {
      const svg = svgRef.current;
      if (!svg) return null;
      const ctm = svg.getScreenCTM();
      if (!ctm) return null;
      const pt = new DOMPoint(clientX, clientY);
      return pt.matrixTransform(ctm.inverse());
    },
    [svgRef]
  );

  const handleRubberBandStart = useCallback(
    (e) => {
      if (!e.altKey || e.button !== 0) return;
      e.preventDefault();
      const pt = toSVGCoords(e.clientX, e.clientY);
      if (!pt) return;

      startRef.current = { x: pt.x, y: pt.y };
      const initial = { x: pt.x, y: pt.y, width: 0, height: 0 };
      rectRef.current = initial;
      setRect(initial);

      const onMove = (moveEvent) => {
        const movePt = toSVGCoords(moveEvent.clientX, moveEvent.clientY);
        if (!movePt || !startRef.current) return;
        const s = startRef.current;
        const newRect = {
          x: Math.min(s.x, movePt.x),
          y: Math.min(s.y, movePt.y),
          width: Math.abs(movePt.x - s.x),
          height: Math.abs(movePt.y - s.y),
        };
        rectRef.current = newRect;
        setRect(newRect);
      };

      const onUp = () => {
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);

        const r = rectRef.current;
        if (r && (r.width >= 4 || r.height >= 4)) {
          const svg = svgRef.current;
          if (svg) {
            const elements = svg.querySelectorAll('[data-node-id]');
            const ids = [];
            for (const el of elements) {
              const bbox = el.getBoundingClientRect();
              const center = toSVGCoords(
                bbox.left + bbox.width / 2,
                bbox.top + bbox.height / 2
              );
              if (
                center &&
                center.x >= r.x &&
                center.x <= r.x + r.width &&
                center.y >= r.y &&
                center.y <= r.y + r.height
              ) {
                ids.push(el.dataset.nodeId);
              }
            }
            if (ids.length > 0) {
              dispatch(addIds(ids));
            }
          }
        }

        startRef.current = null;
        rectRef.current = null;
        setRect(null);
      };

      window.addEventListener('mousemove', onMove);
      window.addEventListener('mouseup', onUp);
    },
    [toSVGCoords, svgRef, dispatch]
  );

  return { rect, handleRubberBandStart };
}
