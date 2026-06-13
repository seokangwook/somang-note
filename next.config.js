const pkg = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { remotePatterns: [{ protocol: "https", hostname: "**" }] },
  env: {
    NEXT_PUBLIC_APP_VERSION: pkg.version,
    NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    NEXT_PUBLIC_VERCEL_ENV: process.env.VERCEL_ENV || 'development',
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
};
module.exports = nextConfig;
