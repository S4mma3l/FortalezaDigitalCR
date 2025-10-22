// frontend/next.config.js
/** @type {import('next').NextConfig} */

// Define el nombre de tu repositorio aquí
const repoName = 'https://s4mma3l.github.io/FortalezaDigitalCR/'; // <-- CAMBIA ESTO AL NOMBRE EXACTO DE TU REPO

const isGithubActions = process.env.GITHUB_ACTIONS || false;

let assetPrefix = '/';
let basePath = '';

if (isGithubActions) {
  // Trim slash if mapRepo exists, and leading slash if not
  // assetPrefix = `/${repoName}/` // Originalmente así, pero puede causar doble slash
  // basePath = `/${repoName}` // Originalmente así
  assetPrefix = `/${repoName}`; // Asegurar un solo slash inicial
  basePath = `/${repoName}`; // Asegurar un solo slash inicial
}


const nextConfig = {
  output: 'export', // Habilita la exportación estática
  // Configurar basePath y assetPrefix para GitHub Pages
  basePath: basePath,
  assetPrefix: assetPrefix,
  images: {
    unoptimized: true, // Necesario para 'next export'
  },
}

module.exports = nextConfig