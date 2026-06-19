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
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-black focus:shadow"
      >
        Saltar al contenido
      </a>
      <h1 className="sr-only">
        Phily — visor y editor de dendrogramas filogenéticos
      </h1>
      <main id="main-content">
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
