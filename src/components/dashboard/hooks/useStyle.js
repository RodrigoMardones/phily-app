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
  const pathColorChange = (e) => {
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
  };
  const pathWidthChange = (e) => {
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
  };
  const labelColorChange = (e) => {
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
  };
  const labelSizeChange = (e) => {
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
  };
  const nodeColorChange = (e) => {
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
  };
  const nodeRadiusChange = (e) => {
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
  };
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
    labelColor
  };
};
export default useStyle;
