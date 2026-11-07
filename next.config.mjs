/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets a test build live in its own folder (NEXT_DIST_DIR=.next-test) without touching a running dev server's .next.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // pdf.js optionally requires the node-only "canvas" package; the browser build never needs it.
  webpack: (config) => {
    config.resolve.alias = { ...config.resolve.alias, canvas: false };
    return config;
  },
};

export default nextConfig;
