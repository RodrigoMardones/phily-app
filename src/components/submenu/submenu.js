import React, { useEffect } from 'react';
import useSubMenu from './useSubmenu';

const SubMenu = () => {
  const { contextMenu, handleClose, modifyNodeRadius, modifyNodeColor } = useSubMenu();
  const { pointerX, pointerY, component, typeElement, toggled } = contextMenu;

  return (
    <div
      id="contextMenuObject"
      className="absolute bg-white shadow-lg z-50"
      style={{
        left: `${pointerX}px`,
        top: `${pointerY}px`,
      }}
      hidden={toggled}
    >
      <ul className="list-none m-0 p-2">
        <li className="p-2 cursor-pointer">
          <label className="label text-black text-sm">Radio</label>
          <input
            type="number"
            className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-[#FAEECC]"
            placeholder="10px"
            min={0}
            onChange={modifyNodeRadius}
          />
        </li>
        <li className="p-2 cursor-pointer">
          <label className="label text-black text-sm">Color</label>
          <input 
          type="color" 
          className="input w-40 h-6 min-h-6 rounded-md"
          onChange={modifyNodeColor}
          />
        </li>
      </ul>
      <button className='btn btn-secondary' onClick={handleClose}>close</button>
    </div>
  );
};

export default SubMenu;
