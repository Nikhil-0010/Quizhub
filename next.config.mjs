/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone", // Optimized for deployment
    experimental: {},
    // Remove "cache" key because Next.js doesn't support it here
  };

export default nextConfig;
