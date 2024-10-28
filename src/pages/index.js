import Canvas from '@/components/canvas/canvas';
import Dashboard from '@/components/dashboard/dashboard';

export async function getStaticProps() {
  return {
    props: {},
  };
}
export default function Home() {
  return (
    <>
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
