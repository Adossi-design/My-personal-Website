import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob public URLs
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Video poster/thumbnail hosts for embedded providers
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
    ],
  },
  eslint: {
    // Type errors still fail the build; lint noise should not block a deploy.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
