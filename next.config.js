// Tạo cấu hình với next-intl
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Cho phép build thành công ngay cả khi có lỗi type
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "netco.com.vn",
        pathname: "**",
      },
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
  },
  async rewrites() {
    return [
      {
        source: "/student/myevent",
        destination: "/myevent",
      },

    ];
  },
};

// Kết hợp cấu hình next-intl với các cấu hình khác
module.exports = nextConfig;
