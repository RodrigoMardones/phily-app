import Canvas from '../../../components/canvas/canvas';
import Dashboard from '../../../components/dashboard/dashboard';
import { useSearchParams } from 'next/navigation';
import useUpload from '../../../components/dashboard/hooks/useUpload';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getTree } from '@/components/store/tree/slice';
import useSWR from 'swr';

export default function page() {
  const searchParams = useSearchParams();
  const jsonFileLink = searchParams.get('link');
  const { handleJsonParamLoad } = useUpload();
  const { tree } = useSelector(getTree);
  const { data, error, isLoading } = useSWR(jsonFileLink, fetch, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (!data || error || isLoading) return;
    const proccess = async () => {
      const tree = await data.json();
      handleJsonParamLoad(JSON.stringify(tree));
    };
    proccess();
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
