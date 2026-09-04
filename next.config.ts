import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Vercel Blob public URLs
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Video poster/thumbnail hosts for embedded providers
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "i.vimeocdn.com" },
      // Genuine project media stored in the owner's public GitHub repositories
      { protocol: "https", hostname: "raw.githubusercontent.com" },
    ],
  },
  eslint: {
    // Type errors still fail the build; lint noise should not block a deploy.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
