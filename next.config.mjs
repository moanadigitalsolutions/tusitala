/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  // Optimization for Heroku deployment
  output: 'standalone',
  images: {
    domains: ['via.placeholder.com'],
    unoptimized: process.env.NODE_ENV === 'production'
  },
  // Handle file uploads in production
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  }
};

export default nextConfig;
