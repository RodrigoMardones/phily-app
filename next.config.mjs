import { createSecureHeaders } from 'next-secure-headers';
import Analyzer from '@next/bundle-analyzer';
import TerserPlugin from 'terser-webpack-plugin';

const isProd = process.env.ENVIRONMENT === 'production';

const scriptSrc =  ["'self'", "'unsafe-inline'", "'unsafe-eval'"];

const connectSrc =  ["'self'", "'unsafe-inline'"];

const styleSrc = ["'self'", "'unsafe-inline'"];

const frameSrc = ["'self'", "'unsafe-inline'"];
const fontSrc = ["'self'", "'unsafe-inline'"];


/** @type {import('next').NextConfig} */
let nextConfig = {
  output: 'standalone',
  swcMinify: true,
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
            directives: {
              defaultSrc: ['self', 'unsafe-inline'],
              styleSrc: isProd ? styleSrc : [...styleSrc ,'localhost:*'],
              connectSrc: isProd ? connectSrc : [...connectSrc ,'localhost:*'],
              scriptSrc: isProd ? scriptSrc : [...scriptSrc, 'localhost:*'],
              frameSrc: isProd ? frameSrc : [...frameSrc, 'localhost:*'],
              fontSrc: isProd ? fontSrc : [...fontSrc, 'localhost:*'],
              imgSrc: isProd ? ['self', 'data:', 'blob:'] : ['self', 'data:', 'blob:', 'localhost:*'],  
            },
          },  
          referrerPolicy: 'no-referrer',
          xssProtection: 'sanitize',
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
