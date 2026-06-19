import '@/styles/globals.css';
import Store from '@/components/store/store';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
export default function App({ Component, pageProps }) {
  const router = useRouter();
  const canonical = `https://phily.cl${(router.asPath || '/').split('?')[0]}`;
  return (
    <Provider store={Store}>
      <Head>
        <title>Phily — Visor y editor de dendrogramas filogenéticos</title>
        <meta
          name="description"
          content="Phily es un visor y editor web de dendrogramas filogenéticos. Sube un archivo Newick o JSON y explora, personaliza y exporta tu árbol filogenético."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content="Phily - Phylogenetic tree viewer" />
        <meta
          property="og:description"
          content="Phily - open source phylogenetic tree viewer for the community"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/treeIcon.jpg" />
        <meta
          property="twitter:title"
          content="Phily - Phylogenetic tree viewer"
        />
        <meta
          property="twitter:description"
          content="Phily - open source phylogenetic tree viewer for the community"
        />
        <meta property="twitter:image" content="/treeIcon.jpg" />
        <meta property="twitter:card" content="summary" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}
