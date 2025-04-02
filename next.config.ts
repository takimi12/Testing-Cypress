/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raddys-web-storage1.s3.eu-north-1.amazonaws.com",
      },
      // Możesz dodać inne domeny w tym miejscu, jeśli chcesz
      {
        protocol: "https",
        hostname: "innostudio.de", // Dodaj domenę, którą chcesz zezwolić na ładowanie obrazów
      },
    ],
  },
};

module.exports = nextConfig;
