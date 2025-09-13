/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // ...any existing remote patterns
    ],
  },
  // ...existing config
};

module.exports = nextConfig;
