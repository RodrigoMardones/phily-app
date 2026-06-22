import { useSelector, useDispatch } from 'react-redux';
import { setError } from '../../store/error/slice';
import { getFile, setFile, clearContent } from '../../store/file/slice';
import { set, getTree } from '../../store/tree/slice';
import { parseStringToTree, createBaseGlobalStyles } from '@/lib/TreeData';
import { validateTotalSchema } from '../validators/dendrogramToJson';
import useError from '@/components/error/hooks/useError';

const useUpload = () => {
  let fileReader;
  const dispatch = useDispatch();
  const file = useSelector(getFile);
  const tree = useSelector(getTree);
  const { handleError } = useError();
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
  // Tubería compartida de carga (valida en el borde con Zod / parser Newick y
  // despacha al store). La usan tanto el botón "Cargar" como el soltar-archivo
  // del estado vacío-héroe, para no duplicar la validación (DRY + un solo borde).
  const loadFileContent = async ({ name, content, extension }) => {
    if (extension === 'json') {
      let parsed;
      try {
        parsed = JSON.parse(content);
        await validateTotalSchema(parsed.tree);
      } catch (error) {
        handleError(
          'El archivo JSON no es válido o no cumple el esquema de Phily. Revisa el archivo e inténtalo de nuevo.'
        );
        return;
      }
      dispatch(
        set({
          ...tree,
          name: parsed.name,
          globalStyles: parsed.globalStyles,
          normalize: parsed.normalize,
          curveType: parsed.curveType,
          angle: parsed.angle,
          width: parsed.width,
          height: parsed.height,
          tree: parsed.tree,
          zoom: parsed.zoom,
        })
      );
      dispatch(clearContent());
    } else if (extension === 'nwk') {
      let parsedTree;
      try {
        parsedTree = parseStringToTree(content);
      } catch (error) {
        handleError(
          'El archivo Newick (.nwk) no tiene un formato válido. Revisa que los paréntesis y las comas estén balanceados.'
        );
        return;
      }
      dispatch(
        set({
          ...tree,
          tree: parsedTree,
          name: name,
          globalStyles: createBaseGlobalStyles({}),
        })
      );
      dispatch(clearContent());
    } else {
      handleError('Formato no compatible. Usa un archivo .nwk o .json.');
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
    await loadFileContent({
      name: file.name,
      content: file.content,
      extension: file.extension,
    });
  };

  // Soltar archivo en el estado vacío-héroe: lee el archivo, lo registra en el
  // store de archivo (igual que handleFileOnChange, para que `file.name` habilite
  // el panel lateral —Dashboard usa disabled={!fileName}—) y lo carga por la
  // misma tubería validada.
  const handleDropFiles = (files) => {
    if (!files?.length) return;
    const dropped = files[0];
    const extension = dropped.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();
    reader.onloadend = () => {
      dispatch(
        setFile({
          name: dropped.name,
          content: reader.result,
          extension,
        })
      );
      loadFileContent({
        name: dropped.name,
        content: reader.result,
        extension,
      });
    };
    reader.readAsText(dropped);
  };

  const handleParamLoad = async (dendrogram) => {
    if (dendrogram === null) return;
    let parsedTree;
    try {
      parsedTree = parseStringToTree(dendrogram);
      dispatch(
        setFile({
          name: 'my-dendrogram',
          content: dendrogram,
          extension: 'nwk',
        })
      );
      dispatch(
        set({
          ...tree,
          tree: parsedTree,
          name: 'dendrogram',
          globalStyles: createBaseGlobalStyles({}),
        })
      );
      dispatch(clearContent());
    } catch (error) {
      handleError(
        'El archivo Newick (.nwk) no tiene un formato válido. Revisa que los paréntesis y las comas estén balanceados.'
      );
      return;
    }
  };

  const handleJsonParamLoad = async (json) => {
    try {
      if (json === null) throw new Error('No se ha seleccionado un archivo');
      const {
        name,
        globalStyles,
        normalize,
        curveType,
        angle,
        width,
        height,
        tree: treeDoc,
      } = JSON.parse(json);
      await validateTotalSchema(treeDoc);
      dispatch(
        setFile({
          name: 'my-dendrogram',
          content: json,
          extension: 'json',
        })
      );
      dispatch(
        set({
          ...tree,
          name: name,
          globalStyles: globalStyles,
          normalize: normalize,
          curveType: curveType,
          angle: angle,
          width: width,
          height: height,
          tree: treeDoc,
        })
      );
      dispatch(clearContent());
    } catch (error) {
      handleError(error.message);
      return;
    }
  };
  return {
    handleFileOnChange,
    handleLoadClick,
    handleDropFiles,
    handleParamLoad,
    handleJsonParamLoad,
  };
};

export default useUpload;
