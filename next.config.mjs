import { createSecureHeaders } from 'next-secure-headers';

const isProd = process.env.ENVIRONMENT === 'production';

const scriptSrc = ['self', 'unsafe-inline'];

const connectSrc = ['self', 'unsafe-inline'];

const styleSrc = ['self', 'unsafe-inline'];

/** @type {import('next').NextConfig} */
const nextConfig = {
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
          directive: {
            defaultSrc: ['self'],
            styleSrc: isProd ? styleSrc : [...styleSrc, 'localhost:*'],
            connectSrc: isProd ? connectSrc : [...connectSrc, 'localhost:*'],
            scriptSrc: isProd ? scriptSrc : [...scriptSrc, 'localhost:*'],
          },
        }),
      },
    ];
  },
};

export default nextConfig;
