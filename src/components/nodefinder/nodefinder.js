import useNodeFinder from '../dashboard/hooks/useNodeFinder';

const NodeFinder = ({ disabled }) => {
  const { query, setQuery, nodeNames, handleSearch, handleKeyDown } =
    useNodeFinder();

  return (
    <div className="flex flex-col">
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          list="node-names-list"
          className="input w-full h-8 min-h-8 rounded-md bg-parchment text-ink text-sm"
          placeholder="Buscar nodo..."
          disabled={disabled}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn btn-secondary h-8 min-h-8 text-white text-sm"
          disabled={disabled || !query.trim()}
          onClick={handleSearch}
        >
          Buscar
        </button>
      </div>
      <datalist id="node-names-list">
        {nodeNames.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>
    </div>
  );
};

export default NodeFinder;
