await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,
  ignoreBuildErrors: true,
  images: {
    domains: ["minio-p4wwo448sowg8ck408gwgc08.intensivestudy.com.np"],
    //domains: ["localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "minio-p4wwo448sowg8ck408gwgc08.intensivestudy.com.np",
        //hostname: "localhost",
        port: "443",
        //port: "9000",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  experimental: {
    serverComponentsExternalPackages: ["pg"],
  },
};

export default config;
