import { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSelectedIds, clearSelection } from '../../store/selection/slice';
import {
  getTree,
  setNodeStyleByIds,
  setLabelStyleByIds,
  setPathStyleByIds,
} from '../../store/tree/slice';


export default function useSelectionEdit() {
  const dispatch = useDispatch();
  const selectedIds = useSelector(getSelectedIds);
  const { globalStyles } = useSelector(getTree);
  const count = selectedIds.length;

  const handleClearSelection = useCallback(() => {
    dispatch(clearSelection());
  }, [dispatch]);

  const modifyNodeRadius = useCallback((e) => {
    dispatch(setNodeStyleByIds({ ids: selectedIds, nodeStyle: { radius: Number(e.target.value) } }));
  }, [dispatch, selectedIds]);

  const modifyNodeColor = useCallback((e) => {
    dispatch(setNodeStyleByIds({ ids: selectedIds, nodeStyle: { fill: e.target.value } }));
  }, [dispatch, selectedIds]);

  const modifyLabelSize = useCallback((e) => {
    dispatch(setLabelStyleByIds({ ids: selectedIds, labelStyle: { fontSize: Number(e.target.value) } }));
  }, [dispatch, selectedIds]);

  const modifyLabelColor = useCallback((e) => {
    dispatch(setLabelStyleByIds({ ids: selectedIds, labelStyle: { fill: e.target.value } }));
  }, [dispatch, selectedIds]);

  const modifyPathWidth = useCallback((e) => {
    dispatch(setPathStyleByIds({ ids: selectedIds, pathStyle: { strokeWidth: Number(e.target.value) } }));
  }, [dispatch, selectedIds]);

  const modifyPathColor = useCallback((e) => {
    dispatch(setPathStyleByIds({ ids: selectedIds, pathStyle: { stroke: e.target.value } }));
  }, [dispatch, selectedIds]);

  return {
    count,
    selectedIds,
    handleClearSelection,
    modifyNodeRadius,
    modifyNodeColor,
    modifyLabelSize,
    modifyLabelColor,
    modifyPathWidth,
    modifyPathColor,
    globalStyles,
  };
}
