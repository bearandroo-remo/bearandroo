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
