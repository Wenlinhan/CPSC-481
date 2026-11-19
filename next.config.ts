import type { NextConfig } from "next";

const githubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath = "/CPSC-481";

const nextConfig: NextConfig = {
  turbopack: { root: process.cwd() },
  ...(githubPages
    ? {
        output: "export" as const,
        trailingSlash: true,
        basePath: githubPagesBasePath,
        assetPrefix: githubPagesBasePath,
        typescript: { ignoreBuildErrors: true },
      }
    : {}),
};

export default nextConfig;
