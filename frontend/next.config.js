// frontend/next.config.js
/** @type {import('next').NextConfig} */

// Define el nombre de tu repositorio aquí
const repoName = 'FortalezaDigitalCR'; // <-- CORRECTO para tu URL

// Determinar si estamos en el entorno de GitHub Actions
const isGithubActions = process.env.GITHUB_ACTIONS || false;

// Configurar basePath y assetPrefix SOLO si estamos en GitHub Actions y hay un repoName
const basePath = isGithubActions && repoName ? `/${repoName}` : '';
const assetPrefix = isGithubActions && repoName ? `/${repoName}/` : undefined;

const nextConfig = {
  output: 'export', // Habilita la exportación estática

  // Aplicar basePath y assetPrefix condicionalmente
  basePath: basePath,
  assetPrefix: assetPrefix,

  // Necesario para 'next export' si usas next/image
  images: {
    unoptimized: true,
  },

  // Asegurar que no haya barra final automática
  trailingSlash: false,
}

module.exports = nextConfig