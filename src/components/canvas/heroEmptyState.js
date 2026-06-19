import { useCallback, useState } from 'react';
import { useUpload } from '../dashboard/hooks';

/**
 * Estado vacío-héroe del lienzo (A2, E1). En lugar de un `Card` blanco vacío,
 * el sujeto del producto —el árbol filogenético— recibe al usuario: un motivo de
 * ramificación "árbol de la vida" que crece con una sola animación orquestada
 * (respetando `prefers-reduced-motion` vía CSS) y dos invitaciones a actuar:
 * probar un ejemplo o soltar un archivo. El soltar alimenta la misma tubería de
 * subida + validación Zod que el panel lateral.
 */
const TreeOfLifeMotif = () => (
  <svg
    width="260"
    height="200"
    viewBox="0 0 260 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="branch-draw mb-2"
    aria-hidden="true"
  >
    <path
      className="branch-draw-path"
      pathLength="1"
      d="M130 196 V150"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      className="branch-draw-path"
      pathLength="1"
      d="M130 150 C112 140 98 128 86 108"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      className="branch-draw-path"
      pathLength="1"
      d="M130 150 C148 140 162 128 174 108"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      className="branch-draw-path stroke-lichen"
      pathLength="1"
      d="M86 108 C78 96 70 86 58 72"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      className="branch-draw-path stroke-lichen"
      pathLength="1"
      d="M86 108 C92 98 96 90 104 78"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      className="branch-draw-path stroke-lichen"
      pathLength="1"
      d="M174 108 C182 96 190 86 202 72"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      className="branch-draw-path stroke-lichen"
      pathLength="1"
      d="M174 108 C168 98 164 90 156 78"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle className="branch-draw-leaf fill-oxide" cx="58" cy="72" r="4" />
    <circle className="branch-draw-leaf fill-oxide" cx="104" cy="78" r="4" />
    <circle className="branch-draw-leaf fill-oxide" cx="202" cy="72" r="4" />
    <circle className="branch-draw-leaf fill-oxide" cx="156" cy="78" r="4" />
    <circle className="branch-draw-leaf fill-herbarium" cx="86" cy="108" r="3.5" />
    <circle className="branch-draw-leaf fill-herbarium" cx="174" cy="108" r="3.5" />
    <circle className="branch-draw-leaf fill-herbarium" cx="130" cy="150" r="3.5" />
  </svg>
);

const HeroEmptyState = () => {
  const { handleJsonParamLoad, handleDropFiles } = useUpload();
  const [isDragging, setIsDragging] = useState(false);

  const handleTryExample = useCallback(async () => {
    // El dataset de ejemplo se carga bajo demanda para no inflar el bundle de la
    // landing; reutiliza @/lib/demo y la tubería JSON + Zod existente.
    const demo = await import('@/lib/demo');
    handleJsonParamLoad(JSON.stringify(demo.data));
  }, [handleJsonParamLoad]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      handleDropFiles(e.dataTransfer?.files);
    },
    [handleDropFiles]
  );

  return (
    <div
      className="flex h-full w-full items-center justify-center p-6 text-ink"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex max-w-md flex-col items-center text-center text-herbarium">
        <TreeOfLifeMotif />
        <h2 className="font-display text-2xl text-ink">
          El árbol de la vida, en tu navegador
        </h2>
        <p className="mt-2 text-sm text-ink/70">
          Sube un archivo Newick (.nwk) o JSON para visualizar y editar tu
          dendrograma filogenético, o comienza con un ejemplo.
        </p>

        <div className="mt-5 flex flex-col items-center gap-3">
          <button
            type="button"
            className="btn btn-secondary text-white"
            onClick={handleTryExample}
          >
            Probar un ejemplo
          </button>

          <div
            className={`flex w-72 flex-col items-center rounded-lg border-2 border-dashed px-4 py-5 text-sm transition-colors ${
              isDragging
                ? 'border-signal bg-signal/10 text-signal'
                : 'border-lichen text-ink/60'
            }`}
          >
            <span>Arrastra aquí un archivo .nwk o .json</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroEmptyState;
