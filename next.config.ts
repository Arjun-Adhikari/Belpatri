import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      {
        source: "/vendors",
        destination: "/?market=vendor",
        permanent: true,
      },
      {
        source: "/vendors/sahyadri-spices-and-dry-fruits-hub",
        destination: "/vendors/himalayan-spice-and-dry-fruit-hub",
        permanent: true,
      },
      {
        source: "/vendors/maha-agri-grain-traders",
        destination: "/vendors/gandaki-grain-traders",
        permanent: true,
      },
      {
        source: "/vendors/deccan-organic-cold-storage",
        destination: "/vendors/annapurna-organic-cold-storage",
        permanent: true,
      },
      {
        source: "/vendors/konkan-agro-produce-co-op",
        destination: "/vendors/koshi-agro-produce-co-op",
        permanent: true,
      },
      {
        source: "/products/salem-curcumin-turmeric",
        destination: "/products/ilam-curcumin-turmeric",
        permanent: true,
      },
      {
        source: "/products/organic-nashik-red-onions",
        destination: "/products/organic-kavre-red-onions",
        permanent: true,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
