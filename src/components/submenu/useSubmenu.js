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
    const contextMenu = document.getElementById('contextMenuObject');
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    // El menú está posicionado de forma absoluta dentro de `#canvas`
    // (su offset parent), así que trabajamos en coordenadas relativas al canvas
    // usando `clientX/clientY`, que comparten sistema con getBoundingClientRect.
    const canvasRect = canvas.getBoundingClientRect();
    const menuRect = contextMenu?.getBoundingClientRect();

    const MARGIN = 8;
    // Mientras el menú está oculto (display:none) su rect es 0; usamos tamaños
    // estimados (el ancho es fijo, `w-64`) hasta que se mide tras la 1ª apertura.
    const menuWidth = menuRect?.width || 256;
    const menuHeight = menuRect?.height || 280;

    // Posición del cursor relativa al canvas.
    const cursorX = event.clientX - canvasRect.left;
    const cursorY = event.clientY - canvasRect.top;

    // Si no cabe a la derecha/abajo del cursor, se abre hacia el lado opuesto
    // para no taparlo; luego se acota para no salir nunca del canvas.
    let newPositionX =
      cursorX + menuWidth + MARGIN > canvasRect.width ? cursorX - menuWidth : cursorX;
    let newPositionY =
      cursorY + menuHeight + MARGIN > canvasRect.height ? cursorY - menuHeight : cursorY;

    const maxX = canvasRect.width - menuWidth - MARGIN;
    const maxY = canvasRect.height - menuHeight - MARGIN;
    newPositionX = Math.max(MARGIN, Math.min(newPositionX, maxX));
    newPositionY = Math.max(MARGIN, Math.min(newPositionY, maxY));

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
