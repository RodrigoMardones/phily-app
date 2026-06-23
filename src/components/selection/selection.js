import useSelectionEdit from './hooks/useSelectionEdit';
import { Card } from 'react-daisyui';
import ColorField from '../common/colorField';

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
          Selección múltiple ({count})
        </Card.Title>
        <button
          className="btn btn-xs btn-error text-white"
          onClick={handleClearSelection}
        >
          Limpiar
        </button>
      </div>

      <Card.Title className="text-white items-end text-sm mt-2">
        Nodos
      </Card.Title>
      <div className="flex justify-evenly md:flex-row sm:flex-col ">
        <div className="md:flex-row sm:flex-col">
          <label className="label text-white text-sm" htmlFor="sel-node-radius">Radio</label>
          <input
            id="sel-node-radius"
            type="number"
            className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-parchment text-ink font-mono"
            placeholder="10"
            min={0}
            defaultValue={globalStyles.nodeStyle.radius}
            onChange={modifyNodeRadius}
          />
        </div>
        <div className="md:flex-row sm:flex-col">
          <label className="label text-white text-sm" htmlFor="sel-node-color">Color</label>
          <ColorField
            id="sel-node-color"
            label="Color de nodo"
            swatchClassName="w-40 h-6 min-h-6 rounded-md"
            defaultValue={globalStyles.nodeStyle.fill}
            onChange={modifyNodeColor}
          />
        </div>
      </div>

      <Card.Title className="text-white items-end text-sm mt-2">
        Etiquetas
      </Card.Title>
      <div className="flex justify-evenly md:flex-row sm:flex-col ">
        <div className="md:flex-row sm:flex-col">
          <label className="label text-white text-sm" htmlFor="sel-label-size">Tamaño</label>
          <input
            id="sel-label-size"
            type="number"
            className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-parchment text-ink font-mono"
            placeholder="12"
            min={0}
            defaultValue={globalStyles.labelStyle.fontSize}
            onChange={modifyLabelSize}
          />
        </div>
        <div className="md:flex-row sm:flex-col">
          <label className="label text-white text-sm" htmlFor="sel-label-color">Color</label>
          <ColorField
            id="sel-label-color"
            label="Color de etiqueta"
            swatchClassName="w-40 h-6 min-h-6 rounded-md"
            defaultValue={globalStyles.labelStyle.fill}
            onChange={modifyLabelColor}
          />
        </div>
      </div>

      <Card.Title className="text-white items-end text-sm mt-2">
        Enlaces
      </Card.Title>
      <div className="flex justify-evenly md:flex-row sm:flex-col ">
        <div className="md:flex-row sm:flex-col relative">
          <label className="label text-white text-sm" htmlFor="sel-path-width">Ancho</label>
          <input
            id="sel-path-width"
            type="number"
            className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-parchment text-ink font-mono"
            placeholder="2"
            min={0}
            defaultValue={globalStyles.pathStyle.strokeWidth}
            onChange={modifyPathWidth}
          />
        </div>
        <div className="md:flex-row sm:flex-col">
          <label className="label text-white text-sm" htmlFor="sel-path-color">Color</label>
          <ColorField
            id="sel-path-color"
            label="Color de enlace"
            swatchClassName="w-40 h-6 min-h-6 rounded-md"
            defaultValue={globalStyles.pathStyle.stroke}
            onChange={modifyPathColor}
          />
        </div>
      </div>
    </div>
  );
};

export default SelectionPanel;
