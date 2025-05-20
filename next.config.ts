import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ignored: [
        "**/node_modules",
        "**/.git",
        "**/C:/Users/Adrien/Application Data/**", // <- ✅ chemin corrigé
        "**/C:/Users/Adrien/**", // ← ajoute cette ligne !
      ],
    };
    return config;
  },
};

export default nextConfig;
