import { useSelector, useDispatch } from 'react-redux';
import { getTree, set as setTree } from '../store/tree/slice';
import { modifyEspecificNodeStyle, createBaseNodeStyle, createBaseLabelStyle } from '@/lib/TreeData';
import {
  set as setContextMenu,
  getContextMenu,
  RESET as resetContextMenu,
} from '../store/submenu/slice';

const useSubMenu = () => {
  const tree = useSelector(getTree);
  const contextMenu = useSelector(getContextMenu);
  const dispatch = useDispatch();
  const { tree: treeData, ...treeRest } = tree;
  const { component } = contextMenu;

  const handleContextMenu = (event, component, nodeIndex, typeElement) => {
    event.preventDefault();
    const element = document.getElementById(`node-${nodeIndex}`);
    const contextMenu = document.getElementById('contextMenuObject');
    const canvas = document.getElementById('canvas');
    const sizeCanvas = canvas.getBoundingClientRect();
    const elementSize = element.getBoundingClientRect();
    const contextMenuSize = contextMenu.getBoundingClientRect();

    // se deja un offsetRelativo al tamaño creado
    const offsetX = contextMenuSize.width ? contextMenuSize.width - 5 : 145;
    const offsetY = contextMenuSize.height ? contextMenuSize.height - 5 : 100;
    const isRight = elementSize.left - sizeCanvas.x > sizeCanvas.width / 2;
    const isBottom = elementSize.y + sizeCanvas.y > sizeCanvas.height / 2;

    // posiciones a guardar para el menu de contexto
    let newPositionX = isRight
      ? elementSize.left - sizeCanvas.x - offsetX
      : elementSize.left - sizeCanvas.x;
    let newPositionY = isBottom
      ? elementSize.y + sizeCanvas.y - offsetY
      : elementSize.y + sizeCanvas.y;

    dispatch(
      setContextMenu({
        pointerX: newPositionX,
        pointerY: newPositionY,
        component: component,
        typeElement: typeElement,
        toggled: false,
      })
    );
  };
  const handleClose = () => {
    dispatch(resetContextMenu());
  };
  /**
   * @description modify the radius of the node
   * @param {*} event event object
   */
  const modifyNodeRadius = (event) => {
    const radius = event.target.value;
    // caso base el estilo no existe
    let componentStyle = component.data?.nodeStyle;

    let clonedTree = structuredClone(treeData);
    const overrideStyle = createBaseNodeStyle({
      ...componentStyle,
      radius: radius,
    });
    dispatch(
      setContextMenu({
        ...contextMenu,
        component: {
          ...component,
          data: {
            ...component.data,
            nodeStyle: overrideStyle,
          },
        },
      })
    );
    modifyEspecificNodeStyle(clonedTree, overrideStyle, component.data.id);
    dispatch(setTree({ ...treeRest, tree: clonedTree }));
  };

  /**
   * @description modify the color of the node
   * @param {*} event event object
   */
  const modifyNodeColor = (event) => {
    const color = event.target.value;
    let componentStyle = component.data.nodeStyle;
    let clonedTree = structuredClone(treeData);
    const overrideStyle = createBaseNodeStyle({
      ...componentStyle,
      fill: color,
    });
    modifyEspecificNodeStyle(clonedTree, overrideStyle, component.data.id);
    dispatch(
      setContextMenu({
        ...contextMenu,
        component: {
          ...component,
          data: {
            ...component.data,
            nodeStyle: overrideStyle,
          },
        },
      })
    );
    dispatch(setTree({ ...treeRest, tree: clonedTree }));
  };

  /**
   * @description modify the size of the label
   * @param {*} event event object
   */
  const modifyLabelSize = (event) => {
    const size = event.target.value;
    let componentStyle = component.data.labelStyle;
    let clonedTree = structuredClone(treeData);
    const overrideStyle = createBaseLabelStyle({
      ...componentStyle,
      fontSize: size,
    });
    modifyEspecificNodeStyle(clonedTree, overrideStyle, component.data.id);
    dispatch(
      setContextMenu({
        ...contextMenu,
        component: {
          ...component,
          data: {
            ...component.data,
            labelStyle: overrideStyle,
          },
        },
      })
    );
    dispatch(setTree({ ...treeRest, tree: clonedTree }));
  };
  /**
   * @description modify the color of the label
   * @param {*} event 
   */
  const modifyLabelColor = (event) => {
    const color = event.target.value;
    let componentStyle = component.data.labelStyle;
    let clonedTree = structuredClone(treeData);
    const overrideStyle = createBaseLabelStyle({
      ...componentStyle,
      fill: color,
    });
    modifyEspecificNodeStyle(clonedTree, overrideStyle, component.data.id);
    dispatch(
      setContextMenu({
        ...contextMenu,
        component: {
          ...component,
          data: {
            ...component.data,
            labelStyle: overrideStyle,
          },
        },
      })
    );
    dispatch(setTree({ ...treeRest, tree: clonedTree }));
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
