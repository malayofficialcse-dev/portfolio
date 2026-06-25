import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production' 
      ? 'https://malaymaity-gjbncxcffbcdfyg3.centralindia-01.azurewebsites.net/api' 
      : 'http://localhost:5001/api',
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://malaymaity-gjbncxcffbcdfyg3.centralindia-01.azurewebsites.net' 
      : 'http://localhost:5001',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'malaymaity-gjbncxcffbcdfyg3.centralindia-01.azurewebsites.net',
        pathname: '/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5001/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://127.0.0.1:5001/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
