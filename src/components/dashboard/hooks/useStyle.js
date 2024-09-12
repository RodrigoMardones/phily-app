import { useCallback, useDeferredValue } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTree, setStyle } from '../../store/tree/slice';

const useStyle = () => {
  const dispatch = useDispatch();
  const tree = useSelector(getTree);
  const { globalStyles } = tree;
  const { labelStyle, nodeStyle, pathStyle } = globalStyles;
  const { stroke : pathColor, strokeWidth : pathWidth  } = pathStyle;
  const { fill : nodeColor, radius : nodeRadius  } = nodeStyle;
  const { fontSize : labelSize, fill: labelColor } = labelStyle;
  const deferredPathColor = useDeferredValue(pathColor, { timeoutMs: 2000 });
  const deferredPathWidth = useDeferredValue(pathWidth, { timeoutMs: 2000 });
  const deferredLabelSize = useDeferredValue(labelSize, { timeoutMs: 2000 });
  const deferredNodeColor = useDeferredValue(nodeColor, { timeoutMs: 2000 });
  const deferredNodeRadius = useDeferredValue(nodeRadius, { timeoutMs: 2000 });
  const deferredLabelColor = useDeferredValue(labelColor, { timeoutMs: 2000 });
  const deferredGlobalStyle = useDeferredValue(globalStyles, { timeoutMs: 2000 });
  
  const pathColorChange = useCallback((e) => {
    e.preventDefault();
    dispatch(
      setStyle({
        globalStyles: {
          ...globalStyles,
          pathStyle: {
            ...pathStyle,
            stroke: e.target.value,
          },
        },
      })
    );
  }, [globalStyles, pathStyle, dispatch]);
  const pathWidthChange = useCallback((e) => {
    e.preventDefault();
    dispatch(
      setStyle({
        globalStyles: {
          ...globalStyles,
          pathStyle: {
            ...pathStyle,
            strokeWidth: e.target.value,
          },
        },
      })
    );
  }, [globalStyles, pathStyle, dispatch]);
  const labelColorChange = useCallback((e) => {
    e.preventDefault();
    dispatch(
      setStyle({
        globalStyles: {
          ...globalStyles,
          labelStyle: {
            ...labelStyle,
            fill: e.target.value,
          },
        },
      })
    );
  }, [globalStyles, labelStyle, dispatch]);
  const labelSizeChange = useCallback((e) => {
    e.preventDefault();
    dispatch(
      setStyle({
        globalStyles: {
          ...globalStyles,
          labelStyle: {
            ...labelStyle,
            fontSize: e.target.value,
          },
        },
      })
    );
  }, [globalStyles, labelStyle, dispatch]);
  const nodeColorChange = useCallback((e) => {
    e.preventDefault();
    dispatch(
      setStyle({
        globalStyles: {
          ...globalStyles,
          nodeStyle: {
            ...nodeStyle,
            fill: e.target.value,
          },
        },
      })
    );
  }, [globalStyles, nodeStyle, dispatch]);
  const nodeRadiusChange = useCallback((e) => {
    e.preventDefault();
    dispatch(
      setStyle({
        globalStyles: {
          ...globalStyles,
          nodeStyle: {
            ...nodeStyle,
            radius: e.target.value,
          },
        },
      })
    );
  }, [globalStyles, nodeStyle, dispatch]);
  return {
    pathColorChange,
    pathWidthChange,
    labelColorChange,
    labelSizeChange,
    nodeColorChange,
    nodeRadiusChange,
    pathColor,
    pathWidth,
    labelSize,
    nodeColor,
    nodeRadius,
    labelColor,
    deferredPathColor,
    deferredPathWidth,
    deferredLabelSize,
    deferredNodeColor,
    deferredNodeRadius,
    deferredLabelColor,
    deferredGlobalStyle
  };
};
export default useStyle;
