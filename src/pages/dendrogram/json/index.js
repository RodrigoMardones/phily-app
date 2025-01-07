import Canvas from '../../../components/canvas/canvas';
import Dashboard from '../../../components/dashboard/dashboard';
import { useSearchParams } from 'next/navigation';
import useUpload from '../../../components/dashboard/hooks/useUpload';
import { useEffect } from 'react';
import useSWR from 'swr';
import { useDispatch } from 'react-redux';
const fetcher = (url) => fetch(url).then((res) => res.json()).catch((err) => err);

export default function Page() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const jsonFileLink = searchParams.get('link');
  const decoded = atob(jsonFileLink);
  const { handleJsonParamLoad, handleError } = useUpload();
  const { data, error, isLoading } = useSWR(decoded, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });
  useEffect(() => {
    if (!data || isLoading) return;
    if (error) {
      handleError('El archivo no tiene el formato correcto');
    }
    if (data) {
      handleJsonParamLoad(JSON.stringify(data));
    }
  }, [data, error, isLoading]);
  return (
    <div
      className="flex h-screen bg-gray-400"
      id="app"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Dashboard />
      <Canvas />
    </div>
  );
}
