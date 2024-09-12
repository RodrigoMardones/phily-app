import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { RESET as resetFile } from '../../store/file/slice';
import { RESET as resetTree } from '../../store/tree/slice';
import { RESET as resetError } from '../../store/error/slice';

export default function useCleanDashboard() {
  const dispatch = useDispatch();
  const handleCleanClick = useCallback((e) => {
    e.preventDefault();
    dispatch(resetFile());
    dispatch(resetTree());
    dispatch(resetError());
    document.getElementById('normalize').checked = false;
    document.getElementById('angle').value = 360;
  },[dispatch]);
  return {
    handleCleanClick,
  };
}
