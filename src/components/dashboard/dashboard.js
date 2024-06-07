import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card } from 'react-daisyui';
import { set, getTree, RESET as resetTree } from '../store/tree/slice';
import { getError, RESET as resetError } from '../store/error/slice';
import { getFile, RESET as resetFile } from '../store/file/slice';
import useDownload from './hooks/useDownload';
import useUpload from './hooks/useUpload';
import Error from '../error/error';
import UploadIcon from '../icons/upload';
import DeleteIcon from '../icons/delete';
import DownloadIcon from '../icons/download';
const accepts = ['.nwk', '.json'];

const Dashboard = () => {
  const dispatch = useDispatch();
  const tree = useSelector(getTree);
  const file = useSelector(getFile);
  const error = useSelector(getError);
  const { download, handleChangeSelectDownload, handleDownload } =
    useDownload();
  const { handleFileOnChange, handleLoadClick } = useUpload();

  const handleCleanClick = (e) => {
    e.preventDefault();
    dispatch(resetFile());
    dispatch(resetTree());
    dispatch(resetError());
    document.getElementById('normalize').checked = false;
    document.getElementById('angle').value = 360;
  };

  return (
    <>
      <Card className="w-96 bg-primary p-4 rounded-none border-none">
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
            <Card.Title className="text-white ml-2 items-end text-4xl align-middle">
              PhilyApp
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
                className="btn h-8 min-h-8 btn-accent mt-2 mr-2 text-white"
                onClick={handleLoadClick}
                disabled={!file.name}
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
              <Card.Title className="text-white items-end text-md">
                Visualización
              </Card.Title>
              <Card.Title className="text-white items-end text-lg mt-2">
                Lateral
              </Card.Title>
              <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
                <button
                  className={`btn h-8 min-h-8 min-w-24 border-none text-white rounded-md ${curveType === 'step' ? 'bg-[#38638B]' : 'bg-[#6DA2D4]'}`}
                  onClick={() => dispatch(set({ ...tree, curveType: 'step' }))}
                >
                  escalon
                </button>
                <button
                  className={`btn h-8 min-h-8 min-w-24 border-none text-white rounded-md ${curveType === 'curve' ? 'bg-[#38638B]' : 'bg-[#6DA2D4]'}`}
                  onClick={() => dispatch(set({ ...tree, curveType: 'curve' }))}
                >
                  suave
                </button>
                <button
                  className={`btn h-8 min-h-8 min-w-24 border-none text-white rounded-md ${curveType === 'slanted' ? 'bg-[#38638B]' : 'bg-[#6DA2D4]'}`}
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
                className={`btn h-8 min-h-8 min-w-36 border-none text-white rounded-md ${curveType === 'circular-step' ? 'bg-[#38638B]' : 'bg-[#6DA2D4]'}`}
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
                className="toggle checked:toggle-secondary active:toggle-secondary"
                id="normalize"
                value={tree.normalize}
                onClick={(e) =>
                  dispatch(set({ ...tree, normalize: e.target.checked }))
                }
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
                  tree.curveType !== 'circular' &&
                  tree.curveType !== 'circular-step'
                }
                className="range range-secondary disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={(e) => {
                  dispatch(set({ ...tree, angle: e.target.value }));
                }}
                onChange={(e) => {
                  dispatch(set({ ...tree, angle: e.target.value }));
                }}
              />
              <span className="text-white text-md label-text">{angle}°</span>
            </label>
            <div className="divider"></div>
            <div id="export">
              <Card.Title className="text-white items-end text-md">
                Exportar
              </Card.Title>
              <div className="flex justify-evenly md:flex-row sm:flex-col mt-2">
                <select
                  className="select select-bordered select-primary w-48 h-8 min-h-8 rounded-md bg-[#FAEECC]"
                  defaultValue={download}
                  onChange={handleChangeSelectDownload}
                  disabled={!file.name}
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
                  disabled={!file.name}
                >
                  {' '}
                  descargar <DownloadIcon className={'invert'} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Dashboard;
