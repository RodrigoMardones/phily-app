import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getTree, set as setTree } from '../store/tree/slice';
import { modifyEspecificNodeStyle } from '@/lib/TreeData';
import {
  set as setContextMenu,
  getContextMenu,
  RESET as resetSubMenu,
} from '../store/submenu/slice';

const useSubMenu = () => {
  const tree = useSelector(getTree);
  const contextMenu = useSelector(getContextMenu);
  const dispatch = useDispatch();
  const { tree: treeData } = tree;

  const handleContextMenu = (event, component, nodeIndex) => {
    event.preventDefault();
    console.log(event)
    const element = document.getElementById(`node-${nodeIndex}`);
    const contextMenu = document.getElementById('contextMenuObject');
    const canvas = document.getElementById('canvas');
    const sizeCanvas = canvas.getBoundingClientRect();
    const elementSize = element.getBoundingClientRect();
    const contextMenuSize = contextMenu.getBoundingClientRect();
    // posiciones a guardar para el menu de contexto
    let newPositionX;
    let newPositionY;
    // se deja un offsetRelativo al tamaño creado
    const offsetX = contextMenuSize.width ? contextMenuSize.width - 5 : 145;
    const offsetY = contextMenuSize.height ? contextMenuSize.height - 5: 100;
    const isRight = (elementSize.left - sizeCanvas.x) > sizeCanvas.width / 2;
    const isBottom = (elementSize.y + sizeCanvas.y) > sizeCanvas.height /2;
    console.log(isRight)
    console.log(isBottom)
    if(isRight) {
      newPositionX = (elementSize.left - sizeCanvas.x) - offsetX
    } else {
      newPositionX = elementSize.left - sizeCanvas.x
    }
    if(isBottom) {
      newPositionY = (elementSize.y + sizeCanvas.y) - offsetY
    } else {
      newPositionY =  elementSize.y + sizeCanvas.y
    }
    dispatch(
      setContextMenu({
        pointerX:  newPositionX ,
        pointerY:  newPositionY,
        component: component,
        toggled: false,
      })
    );
  };
  const handleClose = () => {
    dispatch(resetSubMenu());
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
