import Canvas from '@/components/canvas/canvas'
import Dashboard from '@/components/dashboard/dashboard'
import Head from 'next/head'
export default function Home() {
  return (
    <>
      <Head>
        <title>Phily App </title>
        <meta name="description" content="Philogenetic tree viewer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-screen bg-gray-400" id='app'>
          <Dashboard />
          <Canvas />
        </div>
      </main>
    </>
  )
}
