/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pas d'export statique : le backoffice (/admin) a besoin du serveur Vercel.
  // Les pages restent pré-générées et sont rafraîchies à chaque modification du catalogue.
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
