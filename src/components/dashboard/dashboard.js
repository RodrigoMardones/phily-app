import React, { useEffect, useState } from 'react';
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

import {
  useUpload,
  useDownload,
  useStyle,
  useCleanDashboard,
  useDendrogramForm,
  useBurgerMenu,
} from './hooks';
import { useCallback } from 'react';
const accepts = ['.nwk', '.json'];

const Dashboard = () => {
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

  

  if (isOpen) {
    return (
      <>
        <Card className="bg-primary w-20 p-4 rounded-none border-none overflow-y-auto scrollbar scrollbar-none ml-1/5">
          <button onClick={handleOpen}>
            <Image
              src="/treeIcon.svg"
              width={86}
              height={82}
              className="invert"
              alt="logo"
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
        <Error message={message} open={open} />
        <div className="grid grid-cols-1">
          <div className="flex flex-row items-center">
            <button onClick={handleOpen}>
              <Image
                src="/treeIcon.svg"
                width={86}
                height={82}
                className="invert"
                alt="logo"
              />
            </button>
            <Card.Title className="text-white ml-2 items-end text-4xl align-middle">
              Phily
            </Card.Title>
          </div>
          {/**
           * carga de archivo de arbol
           */}
          <div className="flex flex-col mt-5">
            <Card.Title className="text-white items-end text-md">
              Generar Árbol
            </Card.Title>
            <form>
              <div>
                <label className="label label-text bg-[#FAEECC] rounded text-[#000000] text-opacity-40 min-w-3 mb-2 mt-2 h-8">
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
                cargar
              </Button>
            </form>
          </div>
          <div className="divider mt-2 mb-2"></div>
          {/**
           * Visualizacion de arbol
           */}
          <div className="flex flex-col">
            <div id="visualization">
              <Card.Title className="text-white items-end text-md">
                Visualización
              </Card.Title>
              <span className="label-text text-white text-lg mt-2 text-center">
                Lateral
              </span>
              <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
                <button
                  className={`btn h-8 min-h-8 min-w-24 border-none text-white rounded-md ${deferredCurveType === 'step' ? 'bg-[#38638B]' : 'bg-[#6DA2D4]'}`}
                  value={'step'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  escalon
                </button>
                <button
                  className={`btn h-8 min-h-8 min-w-24 border-none text-white rounded-md ${deferredCurveType === 'curve' ? 'bg-[#38638B]' : 'bg-[#6DA2D4]'}`}
                  value={'curve'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  suave
                </button>
                <button
                  className={`btn h-8 min-h-8 min-w-24 border-none text-white rounded-md ${deferredCurveType === 'slanted' ? 'bg-[#38638B]' : 'bg-[#6DA2D4]'}`}
                  value={'slanted'}
                  disabled={!fileName}
                  onClick={handleStepChange}
                >
                  inclinado
                </button>
              </div>
            </div>
            <span className="label-text text-white text-lg text-left mt-2">
                Circular
              </span>
            <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
              
              <button
                className={`btn h-8 min-h-8 min-w-36 border-none text-white rounded-md ${deferredCurveType === 'circular' ? 'bg-[#38638B]' : 'bg-[#6DA2D4]'}`}
                value={'circular'}
                disabled={!fileName}
                onClick={handleStepChange}
              >
                circular
              </button>
              <button
                className={`btn h-8 min-h-8 min-w-36 border-none text-white rounded-md ${curveType === 'circular-step' ? 'bg-[#38638B]' : 'bg-[#6DA2D4]'}`}
                value={'circular-step'}
                disabled={!fileName}
                onClick={handleStepChange}
              >
                circular escalonado
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
                value={normalize}
                defaultChecked={normalize}
                onClick={handleNormalizationChange}
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
              <span className="text-white text-md label-text">{angle}°</span>
            </label>
            <div className="divider mt-2 mb-2"></div>
            <div id="design">
              <Card.Title className="text-white items-end text-md">
                Diseño general
              </Card.Title>
              <Card.Title className="text-white items-end text-sm mt-2">
                Enlaces
              </Card.Title>
              <div className="flex justify-evenly md:flex-row sm:flex-col ">
                <div className="md:flex-row sm:flex-col">
                  <label className="label text-white text-sm">ancho</label>
                  <input
                    type="number"
                    className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-[#FAEECC]"
                    placeholder="48px"
                    disabled={!fileName}
                    value={pathWidth}
                    onChange={pathWidthChange}
                  />
                </div>
                <div className="md:flex-row sm:flex-col">
                  <label className="label text-white text-sm">color</label>
                  <input
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
                  <label className="label text-white text-sm">radio</label>
                  <input
                    type="number"
                    className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-[#FAEECC]"
                    placeholder="10px"
                    min={0}
                    disabled={!fileName}
                    value={nodeRadius}
                    onChange={nodeRadiusChange}
                  />
                </div>
                <div className="md:flex-row sm:flex-col">
                  <label className="label text-white text-sm">color</label>
                  <input
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
                  <label className="label text-white text-sm">tamaño</label>
                  <input
                    type="number"
                    className="input w-40 h-6 min-h-6 rounded-md mr-2 bg-[#FAEECC]"
                    placeholder="48px"
                    min={0}
                    disabled={!fileName}
                    value={labelSize}
                    onChange={labelSizeChange}
                  />
                </div>
                <div className="md:flex-row sm:flex-col">
                  <label className="label text-white text-sm">color</label>
                  <input
                    type="color"
                    className="input  w-40 h-6 min-h-6 rounded-md"
                    disabled={!fileName}
                    value={labelColor}
                    onChange={labelColorChange}
                  />
                </div>
              </div>
            </div>
            <div className="divider mt-2 mb-2"></div>
            <div id="export">
              <Card.Title className="text-white items-end text-md">
                Exportar
              </Card.Title>
              <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
                <select
                  className="select select-bordered select-primary w-48 h-8 min-h-8 rounded-md bg-[#FAEECC]"
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
                  descargar <DownloadIcon className={'invert'} />
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </Card>
    </>
  );
};

export default Dashboard;
