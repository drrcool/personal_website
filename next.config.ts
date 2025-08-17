/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Base path if deploying to subdirectory
  // basePath: '/subdirectory',

  // Trailing slash consistency
  trailingSlash: true,

  // Environment variables
  env: {
    SITE_URL: process.env.SITE_URL || "https://drrcool.netlify.app",
  },
};

module.exports = nextConfig;
