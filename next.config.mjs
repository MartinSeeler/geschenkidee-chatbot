/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ["de"],
    defaultLocale: "de",
  },
  async redirects() {
    return [
      {
        source: "/produkte/(.*)",
        destination: "/",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/stats/js/script.js",
        destination:
          "https://plausible.io/js/script.file-downloads.outbound-links.pageview-props.local.js",
      },
      {
        source: "/stats/api/event",
        destination: "https://plausible.io/api/event",
      },
    ];
  },
};

export default nextConfig;
