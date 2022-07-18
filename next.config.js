/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["no", "en"],
    defaultLocale: "no",
    localeDetection: true,
  },
};

module.exports = nextConfig;
