import Dashboard from '../../../components/dashboard/dashboard';
import Canvas from '../../../components/canvas/canvas';
import { data } from '../../../lib/demo2';
import { useUpload } from '@/components/dashboard/hooks';
import { useEffect } from 'react';
import { getFile } from '../../../components/store/file/slice';
import { useSelector } from 'react-redux';
import Head from 'next/head';

export default function Page() {
  const { handleJsonParamLoad } = useUpload();
  const { name: fileName } = useSelector(getFile);

  useEffect(() => {
    if (!fileName) {
      handleJsonParamLoad(JSON.stringify(data));
    }
  }, [fileName]);
  return (
    <>
      <Head>
        <title>Demo 2 — Phily | Dendrograma filogenético</title>
      </Head>
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
    </>
  );
}
