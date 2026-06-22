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
      {/* Copy legible por crawlers (WQ-S6). Oculto visualmente por ahora;
          P1 (#4) lo expondrá en el estado vacío-héroe del lienzo (canvas.js). */}
      <section className="sr-only" aria-label="Acerca de Phily">
        <h2>Visualiza y edita árboles filogenéticos en el navegador</h2>
        <p>
          Phily es una herramienta web para visualizar y editar dendrogramas
          filogenéticos. Sube un archivo en formato Newick o JSON y explora el árbol
          de forma interactiva: ajusta el ángulo y la curvatura de las ramas,
          personaliza colores y estilos, busca y resalta nodos, y exporta el
          resultado como imagen o JSON.
        </p>
        <ul>
          <li>Compatible con archivos Newick y JSON.</li>
          <li>Visualización interactiva con zoom y desplazamiento.</li>
          <li>Edición de estilos, colores y disposición de las ramas.</li>
          <li>Exportación del árbol y enlaces para compartir.</li>
        </ul>
      </section>
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
