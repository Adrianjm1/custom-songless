import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Portadas de Deezer y, como respaldo, de iTunes
    remotePatterns: [
      { protocol: "https", hostname: "*.dzcdn.net" },
      { protocol: "https", hostname: "*.mzstatic.com" },
    ],
  },
}

export default nextConfig
