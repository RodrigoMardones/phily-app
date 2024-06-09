import { useSelector } from 'react-redux';
import { getTree, set } from '../../store/tree/slice';
import {useDispatch} from 'react-redux';
const useZoom = () => {
    const dispatch = useDispatch();
    const tree = useSelector(getTree);
    const { width, height } = tree
    const handleAddZoomClick = () => {
        dispatch(set({...tree, width: (width * 2), height: (height * 2)}))
    }
    const handleSubstractZoomClick = () => {
        dispatch(set({...tree, width: (width / 2), height: (height / 2)}))
    }
    return {
        handleAddZoomClick,
        handleSubstractZoomClick
    }
}
export default useZoom;