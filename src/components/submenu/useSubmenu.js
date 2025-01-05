import { useSelector, useDispatch } from 'react-redux';
import { getTree, set as setTree } from '../store/tree/slice';
import {
  modifyEspecificNodeStyle,
  createBaseNodeStyle,
  createBaseLabelStyle,
  modifyEspecificLabelStyle,
  createBasePathStyle,
  modifyEspecificPathStyle
} from '@/lib/TreeData';
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

  const handleContextMenu = (event, component, index, typeElement) => {
    event.preventDefault();
    const element = document.getElementById(`${typeElement}-${index}`);
    const contextMenu = document.getElementById('contextMenuObject');
    const canvas = document.getElementById('canvas');
    const sizeCanvas = canvas.getBoundingClientRect();
    const elementSize = element.getBoundingClientRect();
    const contextMenuSize = contextMenu.getBoundingClientRect();
    // se deja un offsetRelativo al tamaño creado
    const realXMouse = event.pageX;
    const realYmouse = event.pageY;
    const offsetX = contextMenuSize.width ? contextMenuSize.width - 5 : 145;
    const offsetY = contextMenuSize.height ? contextMenuSize.height - 5 : 100;
    const isRight = elementSize.left - sizeCanvas.x > sizeCanvas.width / 2;
    const isBottom = elementSize.y + sizeCanvas.y > sizeCanvas.height / 2;
    
    // posiciones a guardar para el menu de contexto
    let newPositionX = isRight
      ? realXMouse - sizeCanvas.x - offsetX
      : realXMouse - sizeCanvas.x;
    let newPositionY = isBottom
      ? realYmouse + sizeCanvas.y - offsetY
      : realYmouse + sizeCanvas.y;
    
      
    // se obtiene el componente correcto dependiendo del tipo de elemento
    const newComponent = typeElement === 'link' ? component.source : component;
    
    dispatch(
      setContextMenu({
        pointerX: newPositionX,
        pointerY: newPositionY,
        component: newComponent,
        typeElement: typeElement,
        toggled: false,
      })
    );
  };
  const handleClose = () => {
    dispatch(resetContextMenu());
  };
  /**
   * @description modify the radius of the node selected 
   * @param {*} event event object
   */
  const modifyNodeRadius = (event) => {
    const radius = event.target.value;
    // caso base el estilo no existe
    let componentStyle = component.data?.nodeStyle;

    let clonedTree = structuredClone(treeData);
    const overrideStyle = createBaseNodeStyle({
      ...componentStyle,
      radius: Number(radius),
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
   * @description modify the color of the node selected
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
   * @description modify the size of the label of the node selected
   * @param {*} event event object
   */
  const modifyLabelSize = (event) => {
    const size = event.target.value;
    let componentStyle = component.data.labelStyle;
    let clonedTree = structuredClone(treeData);
    const overrideStyle = createBaseLabelStyle({
      ...componentStyle,
      fontSize: Number(size),
    });
    modifyEspecificLabelStyle(clonedTree, overrideStyle, component.data.id);
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
   * @description modify the color of the label of the node selected
   * @param {*} event event object
   */
  const modifyLabelColor = (event) => {
    const color = event.target.value;
    let componentStyle = component.data.labelStyle;
    let clonedTree = structuredClone(treeData);
    const overrideStyle = createBaseLabelStyle({
      ...componentStyle,
      fill: color,
    });
    modifyEspecificLabelStyle(clonedTree, overrideStyle, component.data.id);
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
   * @description modify the color of the path of the node selected
   * @param {*} event event object
   */
  const modifyColorPath = (event) => {
    const color = event.target.value;
    let componentStyle = component.data?.pathStyle;
    let clonedTree = structuredClone(treeData);
    const overrideStyle = createBasePathStyle({
      ...componentStyle,
      stroke: color,
    });
    modifyEspecificPathStyle(clonedTree, overrideStyle, component.data.id);
    dispatch(
      setContextMenu({
        ...contextMenu,
        component: {
          ...component,
          data: {
            ...component.data,
            pathStyle: overrideStyle,
          },
        },
      })
    );
    dispatch(setTree({ ...treeRest, tree: clonedTree }));
  };

  /**
   * @description modify the width of the path of the node selected
   * @param {*} event event object
   */
  const modifyWidthPath = (event) => {
    const width = event.target.value;
    let componentStyle = component.data?.pathStyle;
    let clonedTree = structuredClone(treeData);
    const overrideStyle = createBasePathStyle({
      ...componentStyle,
      strokeWidth: Number(width),
    });
    modifyEspecificPathStyle(clonedTree, overrideStyle, component.data.id);
    dispatch(
      setContextMenu({
        ...contextMenu,
        component: {
          ...component,
          data: {
            ...component.data,
            pathStyle: overrideStyle,
          },
        },
      })
    );
    dispatch(setTree({ ...treeRest, tree: clonedTree }));
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
