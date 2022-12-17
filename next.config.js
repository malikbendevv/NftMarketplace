/** @type {import('next').NextConfig} */
const dedicatedEndPoint = "malikben.infura-ipfs.io";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: dedicatedEndPoint,
        port: "",
        pathname: "/ipfs/**",
      },
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
