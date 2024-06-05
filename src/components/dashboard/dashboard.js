import { forwardRef, useState } from 'react';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card } from 'react-daisyui';
import { parseStringToTree } from '@/utils/TreeData';
import { set, getTree, RESET as resetTree } from '../store/tree/slice';
import { setError, getError, RESET as resetError } from '../store/error/slice';
import { getFile, setFile, RESET as resetFile } from '../store/file/slice';
import Error from '../error/error';
import UploadIcon from '../icons/upload';
import DeleteIcon from '../icons/delete';
import { toPng } from 'html-to-image';
const accepts = ['.nwk', '.json'];

const Dashboard = (props, ref) => {
  let fileReader;
  const dispatch = useDispatch();
  const tree = useSelector(getTree);
  const file = useSelector(getFile);
  const error = useSelector(getError);
  const [download, setDownload] = useState('png');
  const handleChangeSelectDownload = (e) => {
    e.preventDefault();
    setDownload(e.target.value);
  };

  const handleFileRead = () => {
    const extension = fileReader.name.split('.').pop();
    dispatch(
      setFile({
        name: fileReader.name,
        content: fileReader.result,
        extension: extension,
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
    // validar format antes de cargar completo
    if (file.name !== tree.name) {
      if (file.extension == 'json') {
        console.log(file.content);
        dispatch(
          set({ ...tree, tree: JSON.parse(file.content), name: file.name })
        );
      }
      if (file.extension == 'nwk') {
        const parsedTree = parseStringToTree(file.content);
        dispatch(set({ ...tree, tree: parsedTree, name: file.name }));
      }
    }
  };
  const handleCleanClick = (e) => {
    e.preventDefault();
    dispatch(resetFile());
    dispatch(resetTree());
    dispatch(resetError());
    document.getElementById('normalize').checked = false;
    document.getElementById('angle').value = 360;
  };
  const handleDownload = (type) => {
    
    if (type === 'json') {
      const fileName = 'dendrogram';
      const json = JSON.stringify(tree.tree, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const href = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName + '.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    }
    if (type === 'png') {
      let treeSvg = document.querySelector('#treeSvg')

      toPng(treeSvg)
        .then((dataUrl) => {
          let link = document.createElement('a');
          link.download = 'tree.png';
          link.href = dataUrl;
          link.click()
        })
    }
  };
  return (
    <>
      <Card className="p-4 border-none rounded-none w-96 bg-primary">
        <Error message={error.message} open={error.open} />
        <div className="grid grid-cols-1">
          <div className="flex flex-row items-center">
            <Image
              src="/tree.svg"
              width={86}
              height={82}
              className="invert"
              alt="logo"
            />
            <Card.Title className="items-end ml-2 text-4xl text-white align-middle">
              PhilyApp
            </Card.Title>
          </div>
          {/**
           * carga de archivo de arbol
           */}
          <div className="flex flex-col mt-5">
            <Card.Title className="items-end text-white text-md">
              Generar Árbol
            </Card.Title>
            <form>
              <div>
                <label className="label label-text bg-[#FAEECC] rounded text-[#000000] text-opacity-40 min-w-3 mb-2 mt-2 h-8">
                  {file.name ? file.name : 'Adjunta tu archivo'}
                  {!file.name ? (
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
                className="h-8 mt-2 mr-2 text-white btn min-h-8 btn-accent"
                onClick={handleLoadClick}
              >
                cargar
              </Button>
            </form>
          </div>
          <div className="divider"></div>
          {/**
           * Visualizacion de arbol
           */}
          <div className="flex flex-col">
            <div id="visualization">
              <Card.Title className="items-end text-white text-md">
                Visualización
              </Card.Title>
              <Card.Title className="items-end mt-2 text-lg text-white">
                Lateral
              </Card.Title>
              <div className="flex mt-2 justify-evenly md:flex-row sm:flex-col">
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
            <Card.Title className="items-end mt-2 text-lg text-white">
              circular
            </Card.Title>
            <div className="flex mt-2 justify-evenly md:flex-row sm:flex-col">
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
              <span className="mt-2 text-lg text-white label-text">
                Profundidad
              </span>
              <input
                type="checkbox"
                className="toggle checked:toggle-secondary active:toggle-secondary"
                id="normalize"
                value={tree.normalize}
                onClick={(e) =>
                  dispatch(set({ ...tree, normalize: e.target.checked }))
                }
              />
            </label>
            <label className="cursor-pointer label">
              <span className="mt-2 mr-2 text-lg text-white label-text">
                Ángulo
              </span>
              <input
                type="range"
                id="angle"
                min={10}
                max={360}
                defaultValue={360}
                disabled={
                  tree.curveType !== 'circular' &&
                  tree.curveType !== 'circular-step'
                }
                className="mr-2 range range-secondary disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={(e) => {
                  dispatch(set({ ...tree, angle: e.target.value }));
                }}
                onChange={(e) => {
                  dispatch(set({ ...tree, angle: e.target.value }));
                }}
              />
            </label>
            <div className="divider"></div>
            <div id="export">
              <Card.Title className="items-end text-white text-md">
                Exportar
              </Card.Title>
              <div className="flex mt-2 justify-evenly md:flex-row sm:flex-col">
                <select
                  className="select select-bordered select-primary w-48 h-8 min-h-8 rounded-md bg-[#FAEECC]"
                  onChange={handleChangeSelectDownload}
                >
                  {/** revisar como ocupar esto para seleccionar la opcion y exportar al formato pedido */}
                  <option>png</option>
                  <option>json</option>
                </select>
                <button
                  className="w-40 h-8 mx-2 text-white btn btn-secondary min-h-8"
                  onClick={() => handleDownload('png')}
                >
                  {' '}
                  descargar{' '}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};
const WrappedDashboard = forwardRef(Dashboard);
export default WrappedDashboard;
