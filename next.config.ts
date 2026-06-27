import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    domains: [],
    unoptimized: false,
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons"],
  },
}

export default nextConfig
