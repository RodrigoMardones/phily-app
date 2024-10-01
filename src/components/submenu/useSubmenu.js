import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTree, set as setTree } from '../store/tree/slice';
import { modifyEspecificNodeStyle } from '@/lib/TreeData';

const useSubMenu = () => {
  const tree = useSelector(getTree);
  const dispatch = useDispatch();
  const { tree: treeData } = tree;
  const [contextMenu, setContextMenu] = useState(null);
  const handleContextMenu = (event, component) => {
    event.preventDefault();
    setContextMenu({
      mouseX: event.screenX,
      mouseY: event.screenY,
      component,
    });
    console.log(event)
    console.log(component)
  };
  const handleClose = () => {
    setContextMenu(null);
  };
  const modifyColorPath = (name, color) => {
    const newStyle = createBasePathStyle({ fill: color });
    const newtree = { ...treeData };
    modifyEspecificNodeStyle(newtree, name, newStyle);
    dispatch(setTree({ ...tree, hasOwnSyle: true, tree: newtree }));
  };
  const modifyWidthPath = (name, width) => {
    const newStyle = createBasePathStyle({ strokeWidth: width });
    const newtree = { ...treeData };
    modifyEspecificNodeStyle(newtree, name, newStyle);
    dispatch(setTree({ ...tree, hasOwnSyle: true, tree: newtree }));
  };
  const modifyNodeColor = (name, color) => {
    const newStyle = createBaseNodeStyle({ fill: color });
    const newtree = { ...treeData };
    modifyEspecificNodeStyle(newtree, name, newStyle);
    dispatch(setTree({ ...tree, hasOwnSyle: true, tree: newtree }));
  };
  const modifyNodeRadius = (name, radius) => {
    const newStyle = createBaseNodeStyle({ radius: radius });
    const newtree = { ...treeData };
    modifyEspecificNodeStyle(newtree, name, newStyle);
    dispatch(setTree({ ...tree, hasOwnSyle: true, tree: newtree }));
  };
  const modifyLabelSize = (name, size) => {
    const newStyle = createBaseLabelStyle({ fontSize: size });
    const newtree = { ...treeData };
    modifyEspecificNodeStyle(newtree, name, newStyle);
    dispatch(setTree({ ...tree, hasOwnSyle: true, tree: newtree }));
  };
  const modifyLabelColor = (name, color) => {
    const newStyle = createBaseLabelStyle({ fill: color });
    const newtree = { ...treeData };
    modifyEspecificNodeStyle(newtree, name, newStyle);
    dispatch(setTree({ ...tree, hasOwnSyle: true, tree: newtree }));
  };
  return {
    contextMenu,
    setContextMenu,
    handleContextMenu,
    handleClose,
    modifyColorPath,
    modifyWidthPath,
    modifyNodeColor,
    modifyNodeRadius,
    modifyLabelSize,
    modifyLabelColor,
  };
};
export default useSubMenu;
