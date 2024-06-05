import React from 'react'
import { parseStringToTree } from '@/utils/TreeData';
import { set, getTree, RESET as resetTree } from '../../store/tree/slice';
import { setError, getError, RESET as resetError } from '../../store/error/slice';
import { getFile, setFile, RESET as resetFile } from '../../store/file/slice';
import { useDispatch, useSelector } from 'react-redux';

const useUploadFile = () => {

  let fileReader;
  const dispatch = useDispatch();
  const tree = useSelector(getTree);
  const file = useSelector(getFile);
  const error = useSelector(getError);

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


  return { error, tree, file, handleCleanClick, handleLoadClick, handleFileOnChange}
}

export default useUploadFile