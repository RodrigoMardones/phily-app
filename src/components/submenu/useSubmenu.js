import { useSelector, useDispatch } from 'react-redux';
import { setNodeStyleById, setLabelStyleById, setPathStyleById } from '../store/tree/slice';
import {
  createBaseNodeStyle,
  createBaseLabelStyle,
  createBasePathStyle,
} from '@/lib/TreeData';
import {
  set as setContextMenu,
  getContextMenu,
  RESET as resetContextMenu,
} from '../store/submenu/slice';

const useSubMenu = () => {
  const contextMenu = useSelector(getContextMenu);
  const dispatch = useDispatch();
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
    const componentStyle = component.data?.nodeStyle;
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
    dispatch(setNodeStyleById({ id: component.data.id, nodeStyle: overrideStyle }));
  };

  /**
   * @description modify the color of the node selected
   * @param {*} event event object
   */
  const modifyNodeColor = (event) => {
    const color = event.target.value;
    const componentStyle = component.data.nodeStyle;
    const overrideStyle = createBaseNodeStyle({
      ...componentStyle,
      fill: color,
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
    dispatch(setNodeStyleById({ id: component.data.id, nodeStyle: overrideStyle }));
  };

  /**
   * @description modify the size of the label of the node selected
   * @param {*} event event object
   */
  const modifyLabelSize = (event) => {
    const size = event.target.value;
    const componentStyle = component.data.labelStyle;
    const overrideStyle = createBaseLabelStyle({
      ...componentStyle,
      fontSize: Number(size),
    });
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
    dispatch(setLabelStyleById({ id: component.data.id, labelStyle: overrideStyle }));
  };
  /**
   * @description modify the color of the label of the node selected
   * @param {*} event event object
   */
  const modifyLabelColor = (event) => {
    const color = event.target.value;
    const componentStyle = component.data.labelStyle;
    const overrideStyle = createBaseLabelStyle({
      ...componentStyle,
      fill: color,
    });
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
    dispatch(setLabelStyleById({ id: component.data.id, labelStyle: overrideStyle }));
  };

  /**
   * @description modify the color of the path of the node selected
   * @param {*} event event object
   */
  const modifyColorPath = (event) => {
    const color = event.target.value;
    const componentStyle = component.data?.pathStyle;
    const overrideStyle = createBasePathStyle({
      ...componentStyle,
      stroke: color,
    });
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
    dispatch(setPathStyleById({ id: component.data.id, pathStyle: overrideStyle }));
  };

  /**
   * @description modify the width of the path of the node selected
   * @param {*} event event object
   */
  const modifyWidthPath = (event) => {
    const width = event.target.value;
    const componentStyle = component.data?.pathStyle;
    const overrideStyle = createBasePathStyle({
      ...componentStyle,
      strokeWidth: Number(width),
    });
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
    dispatch(setPathStyleById({ id: component.data.id, pathStyle: overrideStyle }));
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
