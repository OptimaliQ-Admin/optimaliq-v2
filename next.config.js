/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true, // Ensures the correct routing structure for App Router
  },
};

module.exports = nextConfig;

