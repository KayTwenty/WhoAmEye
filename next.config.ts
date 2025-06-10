import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "yiwmqqhlnremjzxgokbh.supabase.co",
        pathname: "/storage/v1/object/public/gallery/**",
      },
    ],
  },
};

export default nextConfig;
