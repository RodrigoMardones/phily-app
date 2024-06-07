import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setError } from '../../store/error/slice';
import { getFile, setFile } from '../../store/file/slice';
import { set, getTree } from '../../store/tree/slice';
import { parseStringToTree, getDepth } from '@/utils/TreeData';

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
        dispatch(
          set({
            ...tree,
            tree: JSON.parse(file.content),
            name: file.name,
            width: 600,
            height: 600,
          })
        );
      }
      if (file.extension == 'nwk') {
        const parsedTree = parseStringToTree(file.content);
        console.log(parsedTree)
        const depth = getDepth(parsedTree);
        console.log(depth)
        const width = 100 * depth;
        const height = 100 * depth;
        console.log(width, height)
        dispatch(
          set({
            ...tree,
            tree: parsedTree,
            name: file.name,
            width: width,
            height: height,
          })
        );
      }
    }
  };
  return {
    handleFileOnChange,
    handleLoadClick,
  };
};

export default useUpload;
