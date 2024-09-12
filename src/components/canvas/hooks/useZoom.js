import { useSelector } from 'react-redux';
import { getTree, set } from '../../store/tree/slice';
import {useDispatch} from 'react-redux';
import { useCallback } from 'react';
const useZoom = () => {
    const dispatch = useDispatch();
    const tree = useSelector(getTree);
    const { width, height } = tree
    const handleAddZoomClick = useCallback(() => {
        dispatch(set({...tree, width: (width * 2), height: (height * 2)}))
    }, [dispatch, tree, width, height])
    const handleSubstractZoomClick = useCallback(() => {
        dispatch(set({...tree, width: (width / 2), height: (height / 2)}))
    }, [dispatch, tree, width, height]);
    return {
        handleAddZoomClick,
        handleSubstractZoomClick
    }
}
export default useZoom;