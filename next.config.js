/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  swcMinify: true,

  images: {
    domains: [],
    unoptimized: true, 
  },

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {

      config.watchOptions = {
        poll: 1000, // Verifica mudanças a cada segundo
        aggregateTimeout: 300, // Aguarda 300ms antes de recompilar
      };
    }
    return config;
  },
}

module.exports = nextConfig

