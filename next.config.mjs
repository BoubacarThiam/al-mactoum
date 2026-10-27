/** @type {import('next').NextConfig} */
const nextConfig = {
  // Export statique : le dossier "out" peut être hébergé n'importe où (Vercel, Netlify…)
  output: 'export',
  images: {
    // Les tailles sont générées à l'avance par scripts/optimize-images.mjs
    loader: 'custom',
    loaderFile: './lib/image-loader.ts',
    deviceSizes: [640, 960, 1280, 1920],
    imageSizes: [320, 480],
  },
  trailingSlash: true,
};

export default nextConfig;
