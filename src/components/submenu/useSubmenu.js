import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTree, set as setTree } from '../store/tree/slice';
import { modifyEspecificNodeStyle } from '@/utils/TreeData';

const useSubMenu = () => {
    const tree = useSelector(getTree);
    const dispatch = useDispatch();
    const { name, tree : treeData} = tree;
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const handleSubmenuOpen = () => {
        setSubmenuOpen(!submenuOpen);
    }
    const handleSubmenuClose = () => {
        setSubmenuOpen(false);
    }
    const modifyColorPath = (name, color) => {
        const newStyle = createBasePathStyle({fill: color});
        const newtree = {...treeData};
        modifyEspecificNodeStyle(newtree, name, newStyle);
        dispatch(setTree({...tree, hasOwnSyle: true, tree: newtree}));
    }
};
export default useSubMenu;