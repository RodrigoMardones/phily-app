import Canvas from '@/components/canvas/canvas'
import Dashboard from '@/components/dashboard/dashboard'
import Head from 'next/head'
import { useRef } from 'react';
import html2canvas from 'html2canvas';
export async function getStaticProps() {
  return {
    props: {},
  };
}

export default function Home() {
  const dendrogramRef = useRef();

  return (
    <>
      <Head>
        <title>Phily App</title>
        <meta name="description" content="Philogenetic tree viewer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-screen bg-gray-400" id='app'>
          <Dashboard ref={dendrogramRef}/>
          <Canvas ref={dendrogramRef}/>
        </div>
      </main>
    </>
  )
}
