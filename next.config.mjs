/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Prevent flaky missing-chunk errors in long-running local dev sessions.
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
