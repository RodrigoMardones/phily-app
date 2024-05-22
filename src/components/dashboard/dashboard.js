import React from 'react';
import { Button, Card, FileInput } from 'react-daisyui';
import Image from 'next/image';
import { parseStringToTree } from '@/utils/TreeData';
import Error from '../error/error';
import { set, getTree, RESET as resetTree } from '../store/tree/slice';
import { setError, getError, RESET as resetError } from '../store/error/slice';
import { getFile, setFile, RESET as resetFile } from '../store/file/slice';
import { useDispatch, useSelector } from 'react-redux';
import UploadIcon from '../icons/upload';
const accepts = ['.nwk'];

function Dashboard() {
  let fileReader;
  const dispatch = useDispatch();
  const tree = useSelector(getTree);
  const file = useSelector(getFile);
  const error = useSelector(getError);

  const handleFileRead = () => {
    dispatch(
      setFile({
        name: fileReader.name,
        content: fileReader.result,
      })
    );
  };
  const handleFileOnChange = (e) => {
    const files = e.target.files;
    if (files?.length) {
      fileReader = new FileReader();
      fileReader.name = files[0].name;
      fileReader.onloadend = handleFileRead;
      fileReader.readAsText(files[0]);
    }
  };
  const handleLoadClick = async (e) => {
    /** USECASES */
    /**
     * 1. No file selected
     */
    e.preventDefault();
    if (!file.name) {
      dispatch(
        setError({
          message: 'No se ha seleccionado un archivo',
          open: true,
        })
      );
      return;
    }
    /**
     * 2. File loaded twice
     */
    if (file.name === tree.name) {
      dispatch(
        setError({
          message: 'Se ha cargado el mismo archivo',
          open: true,
        })
      );
      return;
    }
    /**
     * 3. File loaded first time
     */
    if (file.name !== tree.name) {
      const parsedTree = parseStringToTree(file.content);
      dispatch(set({ ...tree, tree: parsedTree, name: file.name }));
    }
  };
  const handleCleanClick = (e) => {
    e.preventDefault();
    dispatch(resetFile());
    dispatch(resetTree());
    dispatch(resetError());
    document.getElementById('fileInput').value = '';
    document.getElementById('normalize').checked = false;
    document.getElementById('angle').value = 360;
  };
  return (
    <>
      <Card className="w-96 bg-primary p-4 rounded-none border-none">
        <Error message={error.message} open={error.open} />
        <div className="grid grid-cols-1">
          <div className="flex flex-row">
            <Image
              src="/phyliApp.jpg"
              width={86}
              height={82}
              className="bg-white rounded-full"
            />
            <Card.Title className="text-white ml-2 items-end text-4xl">
              PhilyApp
            </Card.Title>
          </div>
          {/**
           * carga de archivo de arbol
           */}
          <div className="flex flex-col mt-10">
            <Card.Title className="text-white items-end text-md">
              Generar Árbol
            </Card.Title>
            <form>
              
              <div className=''>
                <label className='label label-text bg-[#FAEECC] rounded text-[#000000] text-opacity-40 min-w-4 mb-2 mt-2'>
                  {file.name ? file.name : 'Adjunta tu archivo'}
                  <input
                    className='file-input file-input-bordered file-input-neutral file-input-xs w-full file-input-rounded min-w-8'
                    type='file'
                    name='fileInput'
                    id='fileInput'
                    onChange={handleFileOnChange}
                    accept={accepts.join(',')}
                    hidden
                  />
                  <UploadIcon />
                </label>
              </div>
              

              <Button
                className="btn h-8 min-h-8 btn-accent mt-2 mr-2 text-white"
                onClick={handleLoadClick}
              >
                cargar
              </Button>
              <Button
                className="btn h-8 min-h-8 btn-error mt-2 mr-2 text-white"
                onClick={handleCleanClick}
              >
                limpiar
              </Button>
            </form>
          </div>
          <div className="divider"></div>
          {/**
           * Visualizacion de arbol
           */}
          <div className="flex flex-col">
            <div id="visualizacion">
              <Card.Title className="text-white items-end text-md">
                Visualización
              </Card.Title>
              <Card.Title className="text-white items-end text-lg mt-2">
                Lateral
              </Card.Title>
              <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
                <button
                  className="btn h-8 min-h-8 min-w-24 bg-[#6DA2D4] border-none text-white rounded-md"
                  onClick={() => dispatch(set({ ...tree, curveType: 'step' }))}
                >
                  escalon
                </button>
                <button
                  className="btn h-8 min-h-8 min-w-24 bg-[#6DA2D4] border-none text-white rounded-md"
                  onClick={() => dispatch(set({ ...tree, curveType: 'curve' }))}
                >
                  suave
                </button>
                <button
                  className="btn h-8 min-h-8 min-w-24 bg-[#6DA2D4] border-none text-white rounded-md"
                  onClick={() =>
                    dispatch(set({ ...tree, curveType: 'slanted' }))
                  }
                >
                  inclinado
                </button>
              </div>
            </div>
            <Card.Title className="text-white items-end text-lg mt-2">
              circular
            </Card.Title>
            <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
              <button
                className="btn h-8 min-h-8 min-w-36 bg-[#6DA2D4] border-none text-white rounded-md"
                onClick={() =>
                  dispatch(set({ ...tree, curveType: 'circular' }))
                }
              >
                circular
              </button>
              <button
                className="btn h-8 min-h-8 min-w-36 bg-[#6DA2D4] border-none text-white rounded-md"
                onClick={() =>
                  dispatch(set({ ...tree, curveType: 'circular-step' }))
                }
              >
                circular escalonado
              </button>
            </div>

            <label className="cursor-pointer label">
              <span className="label-text text-white text-lg mt-2">
                Profundidad
              </span>
              <input
                type="checkbox"
                className="toggle checked:toggle-secondary bg-error hover:bg-error border-error"
                id='normalize'
                value={tree.normalize}
                onClick={(e) =>
                  dispatch(set({ ...tree, normalize: e.target.checked }))
                }
              />
            </label>
            <label className="cursor-pointer label">
              <span className="label-text text-white text-lg mt-2 mr-2">
                Ángulo
              </span>
              <input
                type="range"
                id="angle"
                min={10}
                max={360}
                defaultValue={360}
                disabled={tree.curveType !== 'circular' && tree.curveType !== 'circular-step'}
                className="range range-secondary mr-2 disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={(e) => {
                  dispatch(set({ ...tree, angle: e.target.value }));
                }}
                onChange={(e) => {
                  dispatch(set({ ...tree, angle: e.target.value }));
                }}
              />
            </label>
          </div>
        </div>
      </Card>
    </>
  );
}

export default Dashboard;
