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
  // The heavy D3 dendrogram re-renders from globalStyles; defer only that value
  // so color/range inputs stay responsive. useDeferredValue takes a single
  // argument in React 18 (the previous { timeoutMs } was silently ignored).
  const deferredGlobalStyle = useDeferredValue(globalStyles);
  
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
    deferredGlobalStyle
  };
};
export default useStyle;
