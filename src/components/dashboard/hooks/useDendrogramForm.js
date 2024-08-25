import { useDispatch, useSelector } from 'react-redux';
import { useDeferredValue } from 'react';
import { set as setTree, getTree } from '../../store/tree/slice';

export default function useDendrogramForm() {
  const dispatch = useDispatch();
  const tree = useSelector(getTree);
  const { curveType, normalize, angle } = tree;
  const deferredAngle = useDeferredValue(angle, { timeoutMs: 100000 });
  const deferredCurveType = useDeferredValue(curveType, { timeoutMs: 1000 });
  const deferredNormalize = useDeferredValue(normalize, { timeoutMs: 1000 });

  const handleCurveChange = (name) => {
    dispatch(setTree({ ...tree, curveType: name }));
  };
  const handleNormalizationChange = (e) => {
    dispatch(setTree({ ...tree, normalize: e.target.checked }));
  }
  const handleAngleChange = (e) => {
    dispatch(setTree({ ...tree, angle: e.target.value }));
  }
  return {
    handleCurveChange,
    handleNormalizationChange,
    handleAngleChange,
    deferredAngle,
    deferredCurveType,
    deferredNormalize
  }
}
