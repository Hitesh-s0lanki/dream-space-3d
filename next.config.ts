import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP as the fallback. The showcase and services art is
    // photographic and several of the source PNGs are over 2MB — this is the
    // difference between a band that settles immediately and one that paints in
    // over a second on a normal connection.
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    // Barrel files: importing one named export pulls the whole module graph in
    // development and slows cold compiles considerably. `lucide-react`,
    // `date-fns` and `recharts` are on Next's default list already; these are
    // the ones this project adds, and drei in particular re-exports several
    // hundred modules on top of three.js.
    optimizePackageImports: ["@react-three/drei", "motion", "maath"],
  },
};

export default nextConfig;
