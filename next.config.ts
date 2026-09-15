import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  serverExternalPackages: ["better-sqlite3", "sql.js"],
  // Ensure sql.js wasm is traced into serverless functions on Vercel
  outputFileTracingIncludes: {
    "/": [
      "./node_modules/sql.js/dist/sql-wasm.wasm",
      "./public/sql-wasm.wasm",
    ],
    "/api/**/*": [
      "./node_modules/sql.js/dist/sql-wasm.wasm",
      "./public/sql-wasm.wasm",
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sql.js": path.join(process.cwd(), "node_modules/sql.js"),
    };
    return config;
  },
};

export default nextConfig;
