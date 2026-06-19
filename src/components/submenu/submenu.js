import React, { useEffect, useRef } from 'react';
import useSubMenu from './useSubmenu';
import { useSelector, useDispatch } from 'react-redux';
import { getTree } from '../store/tree/slice';
import { addIds } from '../store/selection/slice';
import { collectSubtreeIds } from '@/lib/TreeData';

const SubMenu = () => {
  const {
    contextMenu,    
    modifyNodeRadius,
    modifyNodeColor,
    modifyLabelSize,
    modifyLabelColor,
    modifyWidthPath,
    modifyColorPath,
    handleClose,
  } = useSubMenu();
  const { globalStyles } = useSelector(getTree);
  const dispatch = useDispatch();
  const { pointerX, pointerY, typeElement, toggled, component } = contextMenu;
  const componentId = component.data?.id;
  const menuRef = useRef(null);

  // Move focus into the editor when it opens so keyboard users land on it, and
  // let Escape close it. `toggled` is true while hidden (WCAG 2.1.2).
  useEffect(() => {
    if (!toggled) {
      menuRef.current?.focus();
    }
  }, [toggled]);

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      handleClose();
    }
  };

  const nodeRadius = component.data?.nodeStyle?.radius ?? globalStyles.nodeStyle.radius;
  const nodeFill = component.data?.nodeStyle?.fill ?? globalStyles.nodeStyle.fill;
  const labelFontSize = component.data?.labelStyle?.fontSize ?? globalStyles.labelStyle.fontSize;
  const labelFill = component.data?.labelStyle?.fill ?? globalStyles.labelStyle.fill;
  const pathStrokeWidth = component.data?.pathStyle?.strokeWidth ?? globalStyles.pathStyle.strokeWidth;
  const pathStroke = component.data?.pathStyle?.stroke ?? globalStyles.pathStyle.stroke;
  const getTitle = () => {
    switch (typeElement) {
      case 'node':
        return 'Editar Nodo';
      case 'label':
        return 'Editar Etiqueta';
      case 'link':
        return 'Editar Enlace';
      default:
        return '';
    }
  };

  return (
    <div
      id="contextMenuObject"
      ref={menuRef}
      role="menu"
      aria-label={getTitle() || 'Editar elemento'}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className="absolute bg-white shadow-lg z-50 rounded-md p-4 focus:outline-none"
      style={{
        left: `${pointerX}px`,
        top: `${pointerY}px`,
      }}
      hidden={toggled}
    >
      <ul className="list-none m-0 p-0 space-y-4">
        <li className="text-lg font-semibold text-gray-700">{getTitle()}</li>
        {typeElement === 'node' && (
          <>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm" htmlFor="submenu-node-radius">Radio</label>
              <input
                id="submenu-node-radius"
                key={`node-radius-${componentId}`}
                type="number"
                className="w-40 h-8 rounded-md bg-parchment text-ink font-mono p-1 ml-auto"
                placeholder="10px"
                min={0}
                defaultValue={nodeRadius}
                onChange={modifyNodeRadius}
              />
            </li>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm" htmlFor="submenu-node-color">Color</label>
              <input
                id="submenu-node-color"
                key={`node-color-${componentId}`}
                type="color"
                className="w-40 h-8 rounded-md p-1 ml-auto"
                defaultValue={nodeFill}
                onChange={modifyNodeColor}
              />
            </li>
          </>
        )}
        {typeElement === 'label' && (
          <>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm" htmlFor="submenu-label-size">Tamaño</label>
              <input
                id="submenu-label-size"
                key={`label-size-${componentId}`}
                type="number"
                className="w-40 h-8 rounded-md bg-parchment text-ink font-mono p-1 ml-auto"
                placeholder="10px"
                min={0}
                defaultValue={labelFontSize}
                onChange={modifyLabelSize}
              />
            </li>
            <li className="flex items-center">
              <label className="text-black text-sm" htmlFor="submenu-label-color">Color</label>
              <input
                id="submenu-label-color"
                key={`label-color-${componentId}`}
                type="color"
                className="w-40 h-8 rounded-md p-1 ml-auto"
                defaultValue={labelFill}
                onChange={modifyLabelColor}
              />
            </li>
          </>
        )}
        {typeElement === 'link' && (
          <>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm" htmlFor="submenu-path-width">Tamaño</label>
              <input
                id="submenu-path-width"
                key={`path-width-${componentId}`}
                type="number"
                className="w-40 h-8 rounded-md bg-parchment text-ink font-mono p-1 ml-auto"
                placeholder="10px"
                min={0}
                defaultValue={pathStrokeWidth}
                onChange={modifyWidthPath}
              />
            </li>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm" htmlFor="submenu-path-color">Color</label>
              <input
                id="submenu-path-color"
                key={`path-color-${componentId}`}
                type="color"
                className="w-40 h-8 rounded-md bg-parchment p-1 ml-auto"
                defaultValue={pathStroke}
                onChange={modifyColorPath}
              />
            </li>
          </>
        )}
        <li>
          <button
            className="btn btn-sm btn-primary text-white w-full mt-2"
            onClick={() => {
              if (!component.data) return;
              const ids = collectSubtreeIds(component.data);
              dispatch(addIds(ids));
              handleClose();
            }}
          >
            Seleccionar subárbol
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SubMenu;
