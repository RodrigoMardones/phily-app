import React from 'react';
import useSubMenu from './useSubmenu';

const SubMenu = () => {
  const {
    contextMenu,
    handleClose,
    
    modifyNodeRadius,
    modifyNodeColor,
    modifyLabelSize,
    modifyLabelColor,
    modifyWidthPath,
    modifyColorPath,
  } = useSubMenu();
  const { pointerX, pointerY, typeElement, toggled, component } = contextMenu;
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
      className="absolute bg-white shadow-lg z-50 rounded-md p-4"
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
              <label className="text-black text-sm">Radio</label>
              <input
                type="number"
                className="w-40 h-8 rounded-md bg-[#FAEECC] p-1 ml-auto"
                placeholder="10px"
                min={0}
                defaultValue={component.data?.nodeStyle?.radius}
                onChange={modifyNodeRadius}
              />
            </li>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm">Color</label>
              <input
                type="color"
                className="w-40 h-8 rounded-md p-1 ml-auto"
                defaultValue={component.data?.nodeStyle?.fill}
                onChange={modifyNodeColor}
              />
            </li>
          </>
        )}
        {typeElement === 'label' && (
          <>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm">Tamaño</label>
              <input
                type="number"
                className="w-40 h-8 rounded-md bg-[#FAEECC] p-1 ml-auto"
                placeholder="10px"
                min={0}
                defaultValue={component.data?.labelStyle?.fontSize}
                onChange={modifyLabelSize}
              />
            </li>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm">Color</label>
              <input
                type="color"
                className="w-40 h-8 rounded-md p-1 ml-auto"
                defaultValue={component.data?.labelStyle?.fill}
                onChange={modifyLabelColor}
              />
            </li>
          </>
        )}
        {typeElement === 'link' && (
          <>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm">Tamaño</label>
              <input
                type="number"
                className="w-40 h-8 rounded-md bg-[#FAEECC] p-1 ml-auto"
                placeholder="10px"
                min={0}
                defaultValue={component.data?.pathStyle?.strokeWidth}
                onChange={modifyWidthPath}
              />
            </li>
            <li className="flex items-center space-x-2">
              <label className="text-black text-sm">Color</label>
              <input
                type="color"
                className="w-40 h-8 rounded-md p-1 ml-auto"
                defaultValue={component.data?.pathStyle?.stroke}
                onChange={modifyColorPath}
              />
            </li>
          </>
        )}
      </ul>
      <button
        className="btn btn-secondary text-white min-h-6 mt-4 px-2 py-1 text-sm"
        onClick={handleClose}
      >
        cerrar
      </button>
    </div>
  );
};

export default SubMenu;
