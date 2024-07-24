import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTree, set as setTree } from '../store/tree/slice';
import { modifyEspecificNodeStyle } from '@/lib/TreeData';

const useSubMenu = () => {
    const tree = useSelector(getTree);
    const dispatch = useDispatch();
    const { tree : treeData} = tree;
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
    const modifyWidthPath = (name, width) => {
        const newStyle = createBasePathStyle({strokeWidth: width});
        const newtree = {...treeData};
        modifyEspecificNodeStyle(newtree, name, newStyle);
        dispatch(setTree({...tree, hasOwnSyle: true, tree: newtree}));
    }
    const modifyNodeColor = (name, color) => {
        const newStyle = createBaseNodeStyle({fill: color});
        const newtree = {...treeData};
        modifyEspecificNodeStyle(newtree, name, newStyle);
        dispatch(setTree({...tree, hasOwnSyle: true, tree: newtree}));
    }
    const modifyNodeRadius = (name, radius) => {
        const newStyle = createBaseNodeStyle({radius: radius});
        const newtree = {...treeData};
        modifyEspecificNodeStyle(newtree, name, newStyle);
        dispatch(setTree({...tree, hasOwnSyle: true, tree: newtree}));
    }
    const modifyLabelSize = (name, size) => {
        const newStyle = createBaseLabelStyle({fontSize: size});
        const newtree = {...treeData};
        modifyEspecificNodeStyle(newtree, name, newStyle);
        dispatch(setTree({...tree, hasOwnSyle: true, tree: newtree}));
    }
    const modifyLabelColor = (name, color) => {
        const newStyle = createBaseLabelStyle({fill: color});
        const newtree = {...treeData};
        modifyEspecificNodeStyle(newtree, name, newStyle);
        dispatch(setTree({...tree, hasOwnSyle: true, tree: newtree}));
    }
    return {
        submenuOpen,
        handleSubmenuOpen,
        handleSubmenuClose,
        modifyColorPath,
        modifyWidthPath,
        modifyNodeColor,
        modifyNodeRadius,
        modifyLabelSize,
        modifyLabelColor
    }
};
export default useSubMenu;