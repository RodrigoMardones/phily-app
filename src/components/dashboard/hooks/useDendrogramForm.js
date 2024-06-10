import { useDispatch, useSelector } from 'react-redux';
import { set as setTree, getTree } from '../../store/tree/slice';

export default function useDendrogramForm() {
  const dispatch = useDispatch();
  const tree = useSelector(getTree);
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
    handleAngleChange
  }
}
