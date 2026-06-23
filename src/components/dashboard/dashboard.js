import React from 'react';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Button, Card } from 'react-daisyui';
import Error from '../error/error';
import UploadIcon from '../icons/upload';
import DeleteIcon from '../icons/delete';
import DownloadIcon from '../icons/download';
import { getTree } from '../store/tree/slice';
import { getFile } from '../store/file/slice';
import { getError } from '../store/error/slice';
import Footer from '../footer/footer';
import NodeFinder from '../nodefinder/nodefinder';
import SelectionPanel from '../selection/selection';
import BranchGlyph from '../icons/branchGlyph';
import ColorField from '../common/colorField';
import {
  useUpload,
  useDownload,
  useStyle,
  useCleanDashboard,
  useDendrogramForm,
  useBurgerMenu,
  useMediaQuery,
} from './hooks';
import { useCallback, useEffect, useRef, useState } from 'react';
const accepts = ['.nwk', '.json'];

// Por debajo de `lg` (Tailwind 1024px) el panel se comporta como drawer.
const BELOW_LG = '(max-width: 1023px)';

// Logo de Phily reutilizado en el rail, el encabezado del panel y el botón
// flotante. Se hoistea fuera del componente para no recrearlo en cada render
// (rendering-hoist-jsx).
const PhilyLogo = ({ priority = false }) => (
  <Image
    src="/treeIcon.svg"
    width={86}
    height={82}
    className="invert"
    alt="Phily"
    priority={priority}
  />
);

// Disclosure progresivo (A3, D1, D2): cada sección del panel es un <details>
// accesible cuyo resumen lleva el glifo de rama (firma §6). Se atenúa y colapsa
// cuando no hay archivo, y se abre solo al cargar uno.
const Section = ({ title, open, onToggle, disabled, children }) => (
  <details
    open={open}
    onToggle={(e) => onToggle(e.currentTarget.open)}
    className={`mt-2 ${disabled ? 'opacity-60' : ''}`}
  >
    <summary className="flex cursor-pointer list-none items-center gap-2 border-t border-lichen/30 py-2 [&::-webkit-details-marker]:hidden">
      <BranchGlyph className="shrink-0 text-lichen" />
      <Card.Title className="text-white items-end text-md">{title}</Card.Title>
    </summary>
    <div className="mt-1">{children}</div>
  </details>
);

export default function Dashboard() {
  const { curveType, angle, normalize } = useSelector(getTree);
  const { name: fileName } = useSelector(getFile);
  const { message, open } = useSelector(getError);
  const { download, handleChangeSelectDownload, handleDownload } =
    useDownload();
  const { handleFileOnChange, handleLoadClick } = useUpload();
  const {
    pathColorChange,
    pathWidthChange,
    labelSizeChange,
    nodeColorChange,
    nodeRadiusChange,
    labelColorChange,
    pathColor,
    pathWidth,
    nodeColor,
    nodeRadius,
    labelSize,
    labelColor,
  } = useStyle();
  const { isOpen, handleOpen, setOpen } = useBurgerMenu();
  const { handleCleanClick } = useCleanDashboard();
  const {
    handleCurveChange,
    handleNormalizationChange,
    handleAngleChange,
    deferredCurveType,
  } = useDendrogramForm();

  const handleStepChange = useCallback(
    (e) => {
      e.preventDefault();
      handleCurveChange(e.target.value);
    },
    [handleCurveChange]
  );

  // `isOpen` (redux) representa "panel colapsado". En escritorio alterna entre
  // panel completo y rail; por debajo de `lg` decide si el drawer está abierto.
  const isSmallScreen = useMediaQuery(BELOW_LG);
  const collapsed = isOpen;
  const drawerOpen = isSmallScreen && !collapsed;

  const panelRef = useRef(null);
  const toggleRef = useRef(null);

  // Cierra el drawer y devuelve el foco al botón flotante. En ref para que los
  // listeners globales no se re-suscriban en cada render (advanced-event-handler-refs).
  const closeRef = useRef(null);
  closeRef.current = () => {
    setOpen(true);
    toggleRef.current?.focus();
  };

  // Al entrar a viewport pequeño, colapsa para mostrar primero el árbol.
  useEffect(() => {
    if (isSmallScreen) setOpen(true);
  }, [isSmallScreen, setOpen]);

  // Con el drawer abierto: foco dentro del panel, Escape cierra y se bloquea el
  // scroll del fondo. Todo se limpia al cerrar.
  useEffect(() => {
    if (!drawerOpen) return undefined;
    panelRef.current?.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeRef.current?.();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  // Las secciones se abren al cargar un archivo y se colapsan al limpiarlo; el
  // usuario puede plegarlas/desplegarlas manualmente (onToggle sincroniza).
  const [openSections, setOpenSections] = useState({
    visualization: false,
    design: false,
    export: false,
  });
  useEffect(() => {
    const next = !!fileName;
    setOpenSections({ visualization: next, design: next, export: next });
  }, [fileName]);
  const toggleSection = useCallback((key, value) => {
    setOpenSections((prev) => ({ ...prev, [key]: value }));
  }, []);

  return (
    <>
      {/* Botón flotante (solo < lg): abre el drawer. Se oculta mientras está
          abierto porque el propio panel ofrece el cierre. */}
      <button
        ref={toggleRef}
        onClick={handleOpen}
        type="button"
        aria-label="Abrir panel"
        aria-expanded={drawerOpen}
        aria-controls="dashboard-panel"
        className={`lg:hidden fixed left-3 top-3 z-50 h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg ${
          drawerOpen ? 'hidden' : 'flex'
        }`}
      >
        <Image
          src="/treeIcon.svg"
          width={32}
          height={30}
          className="invert"
          alt="Phily"
          priority
        />
      </button>

      {/* Backdrop del drawer (solo < lg cuando está abierto). */}
      {drawerOpen ? (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-ink/50"
          onClick={() => closeRef.current?.()}
          aria-hidden="true"
        />
      ) : null}

      {/* Rail colapsado (solo escritorio): muestra el logo para re-expandir. */}
      {collapsed ? (
        <Card className="hidden lg:flex bg-primary w-20 p-4 rounded-none border-none overflow-y-auto scrollbar scrollbar-none">
          <button
            onClick={handleOpen}
            id="expandPanel"
            type="button"
            aria-label="Expandir panel"
            aria-expanded={false}
            aria-controls="dashboard-panel"
          >
            <PhilyLogo priority />
          </button>
        </Card>
      ) : null}

      {/* Panel: en escritorio es columna en flujo; por debajo de `lg` es un
          drawer deslizante superpuesto. Se mantiene montado para animar y
          gestionar el foco. */}
      <aside
        id="dashboard-panel"
        ref={panelRef}
        tabIndex={-1}
        role={isSmallScreen ? 'dialog' : undefined}
        aria-modal={isSmallScreen ? drawerOpen : undefined}
        aria-label="Panel de control"
        onContextMenu={(e) => e.preventDefault()}
        className={`bg-primary p-4 overflow-y-auto scrollbar scrollbar-none focus:outline-none
          fixed inset-y-0 left-0 z-50 w-[min(86vw,360px)] max-w-full
          transition-transform duration-200 ease-out motion-reduce:transition-none
          ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:static lg:z-auto lg:w-auto lg:max-w-none lg:translate-x-0 lg:transition-none
          ${collapsed ? 'lg:hidden' : 'lg:block'}`}
      >
        {message && <Error message={message} open={open} />}
        <div className="grid grid-cols-1">
          <div className="flex flex-row items-center">
            <button
              onClick={handleOpen}
              type="button"
              aria-label="Contraer panel"
              aria-expanded={!collapsed}
              aria-controls="dashboard-panel"
            >
              <PhilyLogo />
            </button>
            <Card.Title className="text-white ml-2 items-end text-4xl align-middle font-display">
              Phily
            </Card.Title>
          </div>
          {/**
           * carga de archivo de arbol
           */}
          <div className="flex flex-col mt-5">
            <Card.Title className="text-white items-end text-md">
              Generar árbol
            </Card.Title>
            <form>
              <div>
                <label className="label label-text bg-parchment rounded text-ink/70 min-w-3 mb-2 mt-2 h-8">
                  {fileName ? fileName : 'Adjunta tu archivo'}
                  {!fileName ? (
                    <>
                      <input
                        type="file"
                        name="fileInput"
                        id="fileInput"
                        onChange={handleFileOnChange}
                        accept={accepts.join(',')}
                        hidden
                      />
                      <UploadIcon />
                    </>
                  ) : (
                    <button onClick={handleCleanClick}>
                      <DeleteIcon />
                    </button>
                  )}
                </label>
              </div>

              <Button
                className="btn h-8 min-h-8 btn-accent mt-2 mr-2 text-white"
                onClick={handleLoadClick}
                disabled={!fileName}
              >
                Cargar
              </Button>
            </form>
          </div>
          <div className="flex flex-col mt-6 mb-6">
            <Card.Title className="text-white items-end text-md">
              Buscar nodo
            </Card.Title>
            <NodeFinder disabled={!fileName} />
          </div>
          {/**
           * Visualizacion de arbol
           */}
          <div className="flex flex-col">
            <Section
              title="Visualización"
              open={openSections.visualization}
              onToggle={(v) => toggleSection('visualization', v)}
              disabled={!fileName}
            >
              <span className="label-text text-white text-lg mt-2 text-center">
                Lateral
              </span>
              <div className="flex flex-col gap-2 mt-2 lg:flex-row lg:justify-evenly">
                <button
                  className={`btn h-8 min-h-8 w-full lg:w-auto lg:min-w-24 border-none rounded-md ${deferredCurveType === 'step' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
                  value={'step'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  Escalón
                </button>
                <button
                  className={`btn h-8 min-h-8 w-full lg:w-auto lg:min-w-24 border-none rounded-md ${deferredCurveType === 'curve' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
                  value={'curve'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  Suave
                </button>
                <button
                  className={`btn h-8 min-h-8 w-full lg:w-auto lg:min-w-24 border-none rounded-md ${deferredCurveType === 'slanted' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
                  value={'slanted'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  Inclinado
                </button>
              </div>
              <span className="label-text text-white text-lg text-left mt-2">
                Circular
              </span>
              <div className="flex flex-col gap-2 mt-2 lg:flex-row lg:justify-evenly">
                <button
                  className={`btn h-8 min-h-8 w-full lg:w-auto lg:min-w-36 border-none rounded-md ${deferredCurveType === 'circular' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
                  value={'circular'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  Circular
                </button>
                <button
                  className={`btn h-8 min-h-8 w-full lg:w-auto lg:min-w-36 border-none rounded-md ${curveType === 'circular-step' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
                  value={'circular-step'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  Circular escalonado
                </button>
              </div>
              <label className="cursor-pointer label mt-2 ">
                <span className="label-text text-white text-lg  text-center">
                  Profundidad
                </span>
                <input
                  type="checkbox"
                  className="toggle checked:toggle-secondary active:toggle-secondary"
                  id="normalize"
                  disabled={!fileName}
                  checked={normalize}
                  onChange={handleNormalizationChange}
                />
              </label>
              <label className="flex gap-2 cursor-pointer label">
                <span className="text-white text-md label-text">Ángulo</span>
                <input
                  type="range"
                  id="angle"
                  min={10}
                  max={360}
                  defaultValue={360}
                  disabled={
                    (deferredCurveType !== 'circular' &&
                      deferredCurveType !== 'circular-step') ||
                    !fileName
                  }
                  className="range range-secondary disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handleAngleChange}
                  onChange={handleAngleChange}
                />
                <span className="text-white text-md label-text font-mono">{angle}°</span>
              </label>
            </Section>
            <div id="design">
              <Section
                title="Diseño general"
                open={openSections.design}
                onToggle={(v) => toggleSection('design', v)}
                disabled={!fileName}
              >
              <Card.Title className="text-white items-end text-sm mt-2">
                Enlaces
              </Card.Title>
              <div className="flex flex-col gap-2 lg:flex-row lg:justify-evenly">
                <div className="w-full lg:w-auto">
                  <label className="label text-white text-sm" htmlFor="path-width">Ancho</label>

                  <input
                    id="path-width"
                    type="number"
                    className="input w-full lg:w-40 h-6 min-h-6 rounded-md bg-parchment text-ink font-mono"
                    placeholder="48px"
                    disabled={!fileName}
                    value={pathWidth}
                    onChange={pathWidthChange}
                  />
                </div>
                <div className="w-full lg:w-auto">
                  <label className="label text-white text-sm" htmlFor="path-color">Color</label>
                  <ColorField
                    id="path-color"
                    label="Color de enlace"
                    className="block w-full lg:w-40"
                    swatchClassName="w-full lg:w-40 h-6 min-h-6 rounded-md"
                    disabled={!fileName}
                    value={pathColor}
                    onChange={pathColorChange}
                  />
                </div>
              </div>
              <Card.Title className="text-white items-end text-sm mt-2">
                Nodos
              </Card.Title>
              <div className="flex flex-col gap-2 lg:flex-row lg:justify-evenly">
                <div className="w-full lg:w-auto">
                  <label className="label text-white text-sm" htmlFor="node-radius">Radio</label>
                  <input
                    id="node-radius"
                    type="number"
                    className="input w-full lg:w-40 h-6 min-h-6 rounded-md bg-parchment text-ink font-mono"
                    placeholder="10px"
                    min={0}
                    disabled={!fileName}
                    value={nodeRadius}
                    onChange={nodeRadiusChange}
                  />
                </div>
                <div className="w-full lg:w-auto">
                  <label className="label text-white text-sm" htmlFor="node-color">Color</label>
                  <ColorField
                    id="node-color"
                    label="Color de nodo"
                    className="block w-full lg:w-40"
                    swatchClassName="w-full lg:w-40 h-6 min-h-6 rounded-md"
                    disabled={!fileName}
                    value={nodeColor}
                    onChange={nodeColorChange}
                  />
                </div>
              </div>
              <Card.Title className="text-white items-end text-sm mt-2">
                Etiquetas
              </Card.Title>
              <div className="flex flex-col gap-2 lg:flex-row lg:justify-evenly">
                <div className="w-full lg:w-auto">
                  <label className="label text-white text-sm" htmlFor="label-size">Tamaño</label>
                  <input
                    id="label-size"
                    type="number"
                    className="input w-full lg:w-40 h-6 min-h-6 rounded-md bg-parchment text-ink font-mono"
                    placeholder="48px"
                    min={0}
                    disabled={!fileName}
                    value={labelSize}
                    onChange={labelSizeChange}
                  />
                </div>
                <div className="w-full lg:w-auto">
                  <label className="label text-white text-sm" htmlFor="label-color">Color</label>
                  <ColorField
                    id="label-color"
                    label="Color de etiqueta"
                    className="block w-full lg:w-40"
                    swatchClassName="w-full lg:w-40 h-6 min-h-6 rounded-md"
                    disabled={!fileName}
                    value={labelColor}
                    onChange={labelColorChange}
                  />
                </div>
              </div>
              </Section>
            </div>
            <SelectionPanel />
            <div id="export">
              <Section
                title="Exportar"
                open={openSections.export}
                onToggle={(v) => toggleSection('export', v)}
                disabled={!fileName}
              >
              <div className="flex flex-col gap-2 mt-2 lg:flex-row lg:justify-evenly">
                <select
                  className="select select-bordered select-primary w-full lg:w-48 h-8 min-h-8 rounded-md bg-parchment text-ink"
                  aria-label="Formato de exportación"
                  defaultValue={download}
                  onChange={handleChangeSelectDownload}
                  disabled={!fileName}
                >
                  {/** revisar como ocupar esto para seleccionar la opcion y exportar al formato pedido */}
                  <option>png</option>
                  <option>svg</option>
                  <option>jpeg</option>
                  <option>json</option>
                </select>
                <button
                  className="btn btn-secondary text-white min-h-8 h-8 w-full lg:w-40"
                  onClick={handleDownload}
                  disabled={!fileName}
                >
                  {' '}
                  Descargar <DownloadIcon />
                </button>
              </div>
              </Section>
            </div>
          </div>
        </div>
        <Footer />
      </aside>
    </>
  );
}
