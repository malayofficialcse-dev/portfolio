import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // API URL is set via NEXT_PUBLIC_API_URL environment variable in Azure App Settings.
  // - Backend Azure Web App URL e.g.: https://<backend-app>.azurewebsites.net/api
  // - Frontend Azure Web App URL e.g.: https://<frontend-app>.azurewebsites.net
  // Do NOT hardcode URLs here — configure them as App Settings in Azure Portal.

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
        // Allow any *.azurewebsites.net hostname (covers both dev & prod backend apps)
        protocol: 'https',
        hostname: '**.azurewebsites.net',
        pathname: '/**',
      },
    ],
  },

  // Rewrites are only needed for local development (when frontend & backend run on the same machine).
  // On Azure, each app is its own service — the frontend calls the backend URL directly via NEXT_PUBLIC_API_URL.
  async rewrites() {
    if (process.env.NODE_ENV !== 'production') {
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
    }
    return [];
  },
};

export default nextConfig;
