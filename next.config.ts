import type { NextConfig } from "next";

function pagesBasePath(): string {
  if (process.env.GITHUB_PAGES !== "true") return "";

  const override = process.env.PAGES_BASE_PATH;
  if (override !== undefined) {
    const trimmed = override.trim().replace(/\/$/, "");
    if (trimmed === "" || trimmed === "/") return "";
    return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  }

  const repository = process.env.GITHUB_REPOSITORY ?? "";
  const [owner, name] = repository.split("/");
  if (!name || name === `${owner}.github.io`) return "";
  return `/${name}`;
}

const basePath = pagesBasePath();

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
