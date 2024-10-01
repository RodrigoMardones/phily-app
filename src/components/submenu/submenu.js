import React, { useEffect, useState } from 'react';
import useSubMenu from './useSubmenu';

const SubMenu = () => {
  const { contextMenu, handleClose } = useSubMenu();
  return (
    <div
      id='contextMenuObject'
      className="absolute bg-white shadow-lg z-50"
      style={{
        left: `${contextMenu.pointerX}px`,
        top: `${contextMenu.pointerY}px`,
      }}
      hidden={contextMenu.toggled}
      onClick={handleClose}
    >
      <ul className="list-none m-0 p-2">
        <li className="p-2 cursor-pointer hover:bg-gray-200">Opción 1</li>
        <li className="p-2 cursor-pointer hover:bg-gray-200">Opción 2</li>
        <li className="p-2 cursor-pointer hover:bg-gray-200">Opción 3</li>
      </ul>
    </div>
  );
};

export default SubMenu;