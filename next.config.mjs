/** @type {import('next').NextConfig} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Setup the bundle analyzer
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos"
      }
    ],
    domains: ["localhost", "harmonious-thrill-30f0c37241.media.strapiapp.com", "abundant-car-e287c4d86f.media.strapiapp.com"],
  },

  // Add webpack configuration for optimizing chunks
  webpack: (config, { isServer }) => {
    // Only apply to client-side bundles
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 70000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          // Pull common third-party dependencies into a shared vendor chunk
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            reuseExistingChunk: true,
          },
          // Group common modules used across multiple pages
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          // Create dedicated chunks for larger modules
          lib: {
            test: /[\\/]node_modules[\\/](react|react-dom|next|@next)[\\/]/,
            name: 'lib',
            priority: 10,
            reuseExistingChunk: true,
          }
        },
      };
    }
    return config;
  },
};

// Export the configuration with the bundle analyzer
export default withBundleAnalyzer(nextConfig);
