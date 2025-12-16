/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Configuração para otimização
  swcMinify: true,
  // Configuração de imagens
  images: {
    domains: [],
    unoptimized: true, // Para permitir SVGs locais
  },
}

module.exports = nextConfig

