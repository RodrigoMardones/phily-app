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

import {
  useUpload,
  useDownload,
  useStyle,
  useCleanDashboard,
  useDendrogramForm,
  useBurgerMenu,
} from './hooks';
import { useCallback, useEffect, useState } from 'react';
const accepts = ['.nwk', '.json'];

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
  const { isOpen, handleOpen } = useBurgerMenu();
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

  if (isOpen) {
    return (
      <>
        <Card className="bg-primary w-20 p-4 rounded-none border-none overflow-y-auto scrollbar scrollbar-none ml-1/5">
          <button
            onClick={handleOpen}
            id="deleteFile"
            type="button"
            aria-label="Expandir panel"
          >
            <Image
              src="/treeIcon.svg"
              width={86}
              height={82}
              className="invert"
              alt="logo"
              priority={true}
            />
          </button>
        </Card>
      </>
    );
  }
  return (
    <>
      <Card
        id="dashboard"
        className="bg-primary w-auto p-4 rounded-none border-none overflow-y-auto scrollbar scrollbar-none"
        onContextMenu={(e) => e.preventDefault()}
      >
        {message && <Error message={message} open={open} />}
        <div className="grid grid-cols-1">
          <div className="flex flex-row items-center">
            <button
              onClick={handleOpen}
              type="button"
              aria-label="Contraer panel"
            >
              <Image
                src="/treeIcon.svg"
                width={86}
                height={82}
                className="invert"
                alt="logo"
              />
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
              <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
                <button
                  className={`btn h-8 min-h-8 min-w-24 border-none rounded-md ${deferredCurveType === 'step' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
                  value={'step'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  Escalón
                </button>
                <button
                  className={`btn h-8 min-h-8 min-w-24 border-none rounded-md ${deferredCurveType === 'curve' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
                  value={'curve'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  Suave
                </button>
                <button
                  className={`btn h-8 min-h-8 min-w-24 border-none rounded-md ${deferredCurveType === 'slanted' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
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
              <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
                <button
                  className={`btn h-8 min-h-8 min-w-36 border-none rounded-md ${deferredCurveType === 'circular' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
                  value={'circular'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  Circular
                </button>
                <button
                  className={`btn h-8 min-h-8 min-w-36 border-none rounded-md ${curveType === 'circular-step' ? 'bg-signal text-white' : 'bg-lichen text-ink'}`}
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
              <div className="flex justify-evenly md:flex-row sm:flex-col ">
                <div className="md:flex-row sm:flex-col relative">
                  <label className="label text-white text-sm" htmlFor="path-width">Ancho</label>

                  <input
                    id="path-width"
                    type="number"
                    className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-parchment text-ink font-mono"
                    placeholder="48px"
                    disabled={!fileName}
                    value={pathWidth}
                    onChange={pathWidthChange}
                  />
                </div>
                <div className="md:flex-row sm:flex-col">
                  <label className="label text-white text-sm" htmlFor="path-color">Color</label>
                  <input
                    id="path-color"
                    type="color"
                    className="input  w-40 h-6 min-h-6 rounded-md"
                    disabled={!fileName}
                    value={pathColor}
                    onChange={pathColorChange}
                  />
                </div>
              </div>
              <Card.Title className="text-white items-end text-sm mt-2">
                Nodos
              </Card.Title>
              <div className="flex justify-evenly md:flex-row sm:flex-col ">
                <div className="md:flex-row sm:flex-col">
                  <label className="label text-white text-sm" htmlFor="node-radius">Radio</label>
                  <input
                    id="node-radius"
                    type="number"
                    className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-parchment text-ink font-mono"
                    placeholder="10px"
                    min={0}
                    disabled={!fileName}
                    value={nodeRadius}
                    onChange={nodeRadiusChange}
                  />
                </div>
                <div className="md:flex-row sm:flex-col">
                  <label className="label text-white text-sm" htmlFor="node-color">Color</label>
                  <input
                    id="node-color"
                    type="color"
                    className="input  w-40 h-6 min-h-6 rounded-md"
                    disabled={!fileName}
                    value={nodeColor}
                    onChange={nodeColorChange}
                  />
                </div>
              </div>
              <Card.Title className="text-white items-end text-sm mt-2">
                Etiquetas
              </Card.Title>
              <div className="flex justify-evenly md:flex-row sm:flex-col ">
                <div className="md:flex-row sm:flex-col">
                  <label className="label text-white text-sm" htmlFor="label-size">Tamaño</label>
                  <input
                    id="label-size"
                    type="number"
                    className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-parchment text-ink font-mono"
                    placeholder="48px"
                    min={0}
                    disabled={!fileName}
                    value={labelSize}
                    onChange={labelSizeChange}
                  />
                </div>
                <div className="md:flex-row sm:flex-col">
                  <label className="label text-white text-sm" htmlFor="label-color">Color</label>
                  <input
                    id="label-color"
                    type="color"
                    className="input  w-40 h-6 min-h-6 rounded-md"
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
              <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
                <select
                  className="select select-bordered select-primary w-48 h-8 min-h-8 rounded-md bg-parchment text-ink"
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
                  className="btn btn-secondary text-white min-h-8 h-8 w-40 mx-2"
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
      </Card>
    </>
  );
}
