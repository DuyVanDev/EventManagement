// Các cấu hình khác cho Next.js
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Cho phép build thành công ngay cả khi có lỗi type
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    
    remotePatterns: [
      { hostname: "images.pexels.com" },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**",
      },

      {
        protocol: "https",
        hostname: "api-crmcak.vps.vn",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "mediaimages.vps.vn",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "admin-netco.vps.vn",
        pathname: "**",
      },
    ],
  }
};

export default nextConfig;
