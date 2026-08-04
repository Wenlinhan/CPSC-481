import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRoot = process.env.CAPTURE_BUILD_ROOT
  ? path.resolve(process.env.CAPTURE_BUILD_ROOT)
  : path.resolve(here, "../..");
const clientRoot = path.join(siteRoot, "dist", "client");
const workerUrl = pathToFileURL(path.join(siteRoot, "dist", "server", "index.js"));
workerUrl.searchParams.set("capture", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);
const portIndex = process.argv.indexOf("--port");
const port = portIndex >= 0 ? Number(process.argv[portIndex + 1]) : 4340;

const mimeTypes = new Map([
  [".css", "text/css; charset=utf-8"], [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"], [".json", "application/json; charset=utf-8"],
  [".png", "image/png"], [".svg", "image/svg+xml"], [".webp", "image/webp"],
  [".woff", "font/woff"], [".woff2", "font/woff2"],
]);

async function staticResponse(request) {
  const url = new URL(request.url);
  const pathname = decodeURIComponent(url.pathname).replace(/^\/+/, "");
  if (!pathname) return null;
  const candidate = path.resolve(clientRoot, pathname);
  if (candidate !== clientRoot && !candidate.startsWith(`${clientRoot}${path.sep}`)) return null;
  try {
    if (!(await stat(candidate)).isFile()) return null;
    return new Response(await readFile(candidate), {
      headers: { "content-type": mimeTypes.get(path.extname(candidate).toLowerCase()) ?? "application/octet-stream" },
    });
  } catch {
    return null;
  }
}

async function route(request) {
  const asset = await staticResponse(request);
  if (asset) return asset;
  return worker.fetch(
    request,
    { ASSETS: { fetch: async assetRequest => (await staticResponse(assetRequest)) ?? new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const server = createServer(async (incoming, outgoing) => {
  try {
    const url = `http://${incoming.headers.host ?? `127.0.0.1:${port}`}${incoming.url ?? "/"}`;
    const response = await route(new Request(url, { method: incoming.method, headers: incoming.headers }));
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    outgoing.end("Capture server error");
  }
});

server.listen(port, "127.0.0.1", () => console.log(`Capture server running at http://127.0.0.1:${port}`));

