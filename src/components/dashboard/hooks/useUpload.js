import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setError } from '../../store/error/slice';
import { getFile, setFile } from '../../store/file/slice';
import { set, getTree } from '../../store/tree/slice';
import {
  parseStringToTree,
  createBaseGlobalStyles,
  countAllNodes,
} from '@/lib/TreeData';
import {validateTotalSchema} from '../validators/dendrogramToJson';

const useUpload = () => {
  let fileReader;
  const dispatch = useDispatch();
  const file = useSelector(getFile);
  const tree = useSelector(getTree);
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
        // validar schema
        try {
          const { tree: treeDoc } = JSON.parse(file.content);
          await validateTotalSchema(treeDoc);
    
        } catch (error) {
          dispatch(
            setError({
              message: 'El archivo no tiene el formato correcto',
              open: true,
            })
          );
          return;
        }
        const { content } = file;
        const {
          name,
          globalStyles,
          normalize,
          curveType,
          angle,
          width,
          height,
          tree: treeDoc,
        } = JSON.parse(content);
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
      }
      if (file.extension == 'nwk') {
        let parsedTree;
        try {
          parsedTree = parseStringToTree(file.content);
        } catch (error) {
          dispatch(
            setError({
              message: 'El archivo no tiene el formato correcto',
              open: true,
            })
          );
          return;
        }
        dispatch(
          set({
            ...tree,
            tree: parsedTree,
            name: file.name,
            globalStyles: createBaseGlobalStyles({}),
          })
        );
      }
    }
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
    } catch (error) {
      // fallar por cualquier cosa
      dispatch(
        setError({
          message: 'El archivo no tiene el formato correcto',
          open: true,
        })
      );
      return;
    }
  };

  const handleJsonParamLoad = async (json) => {  
    try {
      if (json === null) return;
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
    } catch (error) {
      // fallar por cualquier cosa
      dispatch(
        setError({
          message: 'El archivo no tiene el formato correcto',
          open: true,
        })
      );
      return;
    }
  };

  return {
    handleFileOnChange,
    handleLoadClick,
    handleParamLoad,
    handleJsonParamLoad,
  };
};

export default useUpload;
