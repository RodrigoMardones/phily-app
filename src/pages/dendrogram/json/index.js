import Canvas from '../../../components/canvas/canvas';
import Dashboard from '../../../components/dashboard/dashboard';
import { useSearchParams } from 'next/navigation';
import useUpload from '../../../components/dashboard/hooks/useUpload';
import { useEffect } from 'react';
import useSWR from 'swr';

const fetcher = (url) =>
  fetch(url)
    .then((res) => res.json())
    
export default function Page() {
  const searchParams = useSearchParams();
  const jsonFileLink = searchParams.get('link');
  const decoded = atob(jsonFileLink);
  const { handleJsonParamLoad } = useUpload();
  const { data, error, isLoading } = useSWR(decoded, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (!data|| error || isLoading) return;

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
