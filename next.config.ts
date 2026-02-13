/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@react-pdf/renderer'],
  experimental: {
    serverActions: true,
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
  webpack: (config: any) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;