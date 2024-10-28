import '@/styles/globals.css';
import Store from '@/components/store/store';
import { Provider } from 'react-redux';
import Head from 'next/head';
export default function App({ Component, pageProps }) {
  return (
    <Provider store={Store}>
      <Head>
        <title>Phily</title>
        <meta name="description" content="Phily - Philogenetic tree viewer" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:title" content="Phily - Philogenetic tree viewer" />
        <meta
          property="og:description"
          content="Phily - open source philogenetic tree viewer for the comunity"
        />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/treeIcon.jpg" />
        <meta
          property="twitter:tile"
          content="Phily - Philogenetic tree viewer"
        />
        <meta
          property="twitter:description"
          content="Phily - open source philogenetic tree viewer for the comunity"
        />
        <meta property="twitter:image" content="/treeIcon.jpg" />
        <meta property="twitter:card" content="summary" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}
