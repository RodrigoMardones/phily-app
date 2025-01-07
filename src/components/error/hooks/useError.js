import { setError } from '../../store/error/slice';
import { useDispatch } from 'react-redux';
const useError = () => {
  const dispatch = useDispatch();

  const handleError = (error) => {
    dispatch(
      setError({
        message: error,
        open: true,
      })
    );
  };
  return { handleError };
};

export default useError;
