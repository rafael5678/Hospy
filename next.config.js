/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones de producción
  swcMinify: true,
  compress: true,
  
  // Optimizar imágenes
  images: {
    domains: [],
    formats: ['image/webp'],
  },
  
  // Configuración de compilación optimizada
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Optimizar bundle
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
  },
  
  // Headers para mejor performance
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
