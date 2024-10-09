import LZString from 'lz-string';
import Canvas from '../../components/canvas/canvas';
import Dashboard from '../../components/dashboard/dashboard';
import { useSearchParams } from 'next/navigation';
import useUpload from '../../components/dashboard/hooks/useUpload';
import { useEffect } from 'react';

export default function page() {
  const searchParams = useSearchParams();
  const compressedTree = searchParams.get('tree');
  const { handleParamLoad } = useUpload();
  
  useEffect(() => {
    const tree = LZString.decompressFromEncodedURIComponent(compressedTree);
    handleParamLoad(tree);
  }, [compressedTree]);
  return (
    <div
      className="flex h-screen bg-gray-400"
      id="app"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Dashboard/>
      <Canvas />
    </div>
  );
}
