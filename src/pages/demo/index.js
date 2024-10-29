import Dashboard from '../../components/dashboard/dashboard';
import Canvas from '../../components/canvas/canvas';
import { data } from '../../lib/demo';
import { useUpload } from '@/components/dashboard/hooks';
import { useEffect } from 'react';
import { getFile } from '../../components/store/file/slice';
import { useSelector } from 'react-redux';

export default function Page() {
  const { handleJsonParamLoad } = useUpload();
  const { name: fileName } = useSelector(getFile);

  useEffect(() => {
    if (!fileName) {
      handleJsonParamLoad(JSON.stringify(data));
    }
  }, [fileName]);
  return (
    <main>
      <div
        className="flex h-screen bg-gray-400"
        id="app"
        onContextMenu={(e) => e.preventDefault()}
      >
        <Dashboard />
        <Canvas />
      </div>
    </main>
  );
}
