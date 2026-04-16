import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevents Next.js/webpack from bundling pdfjs-dist on the server.
  // When bundled, pdfjs tries to load pdf.worker.mjs via a path that
  // doesn't exist in the .next/server/chunks directory, causing a runtime crash.
  serverExternalPackages: ["pdfjs-dist", "unpdf", "canvas"],
};

export default nextConfig;
