import '@/styles/globals.css';
import Store from '@/components/store/store';
import { Provider } from 'react-redux';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fraunces, Public_Sans, IBM_Plex_Mono } from 'next/font/google';

// Self-hosted via next/font (zero CLS, no render-blocking CSS) — resolves A1 + F1.
// Display = Fraunces (lámina naturalista), body/UI = Public Sans, datos = IBM Plex Mono.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});
const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});
const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Phily',
  url: 'https://phily.cl',
  description:
    'Phily es un visor y editor web de dendrogramas filogenéticos. Sube un archivo Newick o JSON y explora, personaliza y exporta tu árbol filogenético.',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  inLanguage: 'es',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3A5A40" />
      </Head>
      <div
        className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} font-sans`}
      >
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}
