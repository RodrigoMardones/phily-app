import { useRouter } from 'next/router';
import Canvas from '../../components/canvas/canvas';
import Dashboard from '../../components/dashboard/dashboard';
import { useSearchParams } from 'next/navigation';
import useUpload from '../../components/dashboard/hooks/useUpload';
import { useEffect } from 'react';

export default function page() {
  const searchParams = useSearchParams();
  const tree = searchParams.get('tree');
  const decodedTree = atob(tree);
  const { handleParamLoad } = useUpload();

  useEffect(() => {
    handleParamLoad(decodedTree);
  }, [tree]);
  return (
    <div
      className="flex h-screen bg-gray-400"
      id="app"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Dashboard dendrogram={tree}/>
      <Canvas />
    </div>
  );
}
