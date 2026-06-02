import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

const nextConfig = {
  turbopack: {
    root: '../../',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bearandroo-storage.b-cdn.net',
      },
    ],
  },
};

export default nextConfig;
