import Canvas from '@/components/canvas/canvas'
import Dashboard from '@/components/dashboard/dashboard'
import Head from 'next/head'

export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Home() {

  return (
    <>
      <Head>
        <title>Phily App</title>
        <meta name="description" content="Phily - Philogenetic tree viewer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property='og:title' content="Phily - Philogenetic tree viewer"/>
        <meta property='og:description' content="Phily - open source philogenetic tree viewer for the comunity"/>
        <meta property='og:image' content="/favicon.ico"/>
      </Head>
      <main>
        <div className="flex h-screen bg-gray-400" id='app'>
          <Dashboard/>
          <Canvas/>
        </div>
      </main>
    </>
  )
}
