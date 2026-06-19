import { createSecureHeaders } from 'next-secure-headers';
import Analyzer from '@next/bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';

const isProd = process.env.ENVIRONMENT === 'production';

// add the https://phily.cl/onfig to the CSP
const scriptSrc = isProd ? ["'self'", "https://phily.cl/"] : ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://phily.cl/"];
const connectSrc = isProd ? ["'self'", "https://phily.cl/"] : ["'self'", "'unsafe-inline'", "https://phily.cl/"];
const styleSrc = isProd ? ["'self'", "https://phily.cl/"] : ["'self'", "'unsafe-inline'", "https://phily.cl/"];
const frameSrc = isProd ? ["'self'", "https://phily.cl/"] : ["'self'", "'unsafe-inline'", "https://phily.cl/"];
const fontSrc = isProd ? ["'self'", "phily", "https://phily.cl/"] : ["'self'", "'unsafe-inline'", "https://phily.cl/"];
const imgSrc = isProd ? ["'self'", 'data:', 'blob:', "https://phily.cl/"] : ["'self'",'data:', 'blob:', "'unsafe-inline'", "https://phily.cl/"];


/** @type {import('next').NextConfig} */
let nextConfig = {
  output: 'standalone',
  compress: true,
  transpilePackages: ['react-daisyui'],
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'phily.vercel.app'],
  },
  eslint: {
    ignoreDuringBuilds: true, 
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            // if is prod quit the ubsafe-inline and unsafe-eval
            directives: {
              defaultSrc: ['self'],
              styleSrc: isProd ? styleSrc : [...styleSrc ,'localhost:*'],
              connectSrc: isProd ? connectSrc : [...connectSrc ,'localhost:*'],
              scriptSrc: isProd ? scriptSrc : [...scriptSrc, 'localhost:*'],
              frameSrc: isProd ? frameSrc : [...frameSrc, 'localhost:*'],
              fontSrc: isProd ? fontSrc : [...fontSrc, 'localhost:*'],
              imgSrc: isProd ? imgSrc : [...imgSrc, 'localhost:*'],
            },
          },  
          referrerPolicy: 'no-referrer',
          frameGuard: "deny"
        }),
      },
    ];
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // Eliminar console.log
            },
            mangle: true, // Ofuscar nombres de variables
          },
        })
      );
    }
    return config;
  },
};

const withBundleAnalyzer = Analyzer({
  enabled: process.env.ANALYZE === 'true',
})

nextConfig = withBundleAnalyzer(nextConfig);

export default nextConfig;
