import useSelectionEdit from './hooks/useSelectionEdit';
import { Card } from 'react-daisyui';

const SelectionPanel = () => {
  const {
    count,
    handleClearSelection,
    modifyNodeRadius,
    modifyNodeColor,
    modifyLabelSize,
    modifyLabelColor,
    modifyPathWidth,
    modifyPathColor,
    globalStyles,
  } = useSelectionEdit();

  if (count === 0) return null;

  return (
    <div className="flex flex-col mt-4 mb-4">
      <div className="flex items-center justify-between">
        <Card.Title className="text-white items-end text-md">
          Selección multiple ({count})
        </Card.Title>
        <button
          className="btn btn-xs btn-error text-white"
          onClick={handleClearSelection}
        >
          Limpiar
        </button>
      </div>

      <div className="mt-3">
        <p className="text-white text-sm font-medium mb-1">Nodos</p>
        <div className="flex gap-2 items-center">
          <label className="text-white text-xs w-12">radio</label>
          <input
            type="number"
            className="input w-full h-8 min-h-8 rounded-md bg-[#FAEECC] text-sm"
            placeholder="10"
            min={0}
            defaultValue={globalStyles.nodeStyle.radius}
            onChange={modifyNodeRadius}
          />
          <label className="text-white text-xs w-12">color</label>
          <input
            type="color"
            className="h-8 w-16 min-h-8 rounded-md"
            defaultValue={globalStyles.nodeStyle.fill}
            onChange={modifyNodeColor}
          />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-white text-sm font-medium mb-1">Etiquetas</p>
        <div className="flex gap-2 items-center">
          <label className="text-white text-xs w-12">tamaño</label>
          <input
            type="number"
            className="input w-full h-8 min-h-8 rounded-md bg-[#FAEECC] text-sm"
            placeholder="12"
            min={0}
            defaultValue={globalStyles.labelStyle.fontSize}
            onChange={modifyLabelSize}
          />
          <label className="text-white text-xs w-12">color</label>
          <input
            type="color"
            className="h-8 w-16 min-h-8 rounded-md"
            defaultValue={globalStyles.labelStyle.fill}
            onChange={modifyLabelColor}
          />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-white text-sm font-medium mb-1">Enlaces</p>
        <div className="flex gap-2 items-center">
          <label className="text-white text-xs w-12">ancho</label>
          <input
            type="number"
            className="input w-full h-8 min-h-8 rounded-md bg-[#FAEECC] text-sm"
            placeholder="2"
            min={0}
            defaultValue={globalStyles.pathStyle.strokeWidth}
            onChange={modifyPathWidth}
          />
          <label className="text-white text-xs w-12">color</label>
          <input
            type="color"
            className="h-8 w-16 min-h-8 rounded-md"
            defaultValue={globalStyles.pathStyle.stroke}
            onChange={modifyPathColor}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionPanel;
