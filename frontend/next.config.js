// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Habilita la exportación estática
  // DESCOMENTA Y AJUSTA si tu repo NO es tu-usuario.github.io
  // basePath: '/fortaleza-digital-cr', // Nombre de tu repositorio
  // assetPrefix: '/fortaleza-digital-cr/', // Nombre de tu repositorio con /
  images: {
    unoptimized: true, // Necesario para 'next export'
  },
}
module.exports = nextConfig