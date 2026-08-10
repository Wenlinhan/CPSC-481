import { createHash } from "node:crypto";
import fs from "node:fs";
import { mkdir, rename, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

const COURSE_ID = "3586560";
const CANVAS = "https://csufullerton.instructure.com";
const token = fs.readFileSync(path.resolve("..", "Canvas API.txt"), "utf8").split(/\r?\n/).map(value => value.trim()).filter(Boolean).at(-1);
const fileIds = [284175815, 284175816, 284175817, 284175818, 283918713, 283969230];
const outputDir = path.resolve("output", "canvas-backups", "superseded-module9-10-media-2026-08-09");

async function request(endpoint) {
  const response = await fetch(`${CANVAS}/api/v1/${endpoint}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error(`GET ${endpoint}: ${response.status} ${(await response.text()).slice(0, 500)}`);
  return response.json();
}

await mkdir(outputDir, { recursive: true });
const manifest = { capturedAt: new Date().toISOString(), courseId: COURSE_ID, files: [] };
for (const id of fileIds) {
  const metadata = await request(`files/${id}`);
  const destination = path.join(outputDir, `${id}-${metadata.display_name}`);
  const temporary = `${destination}.part`;
  console.log(`[canvas-backup] ${id} ${metadata.display_name}`);
  const response = await fetch(metadata.url, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok || !response.body) throw new Error(`Download ${id}: ${response.status}`);
  const hash = createHash("sha256");
  const hashing = new Transform({ transform(chunk, _encoding, callback) { hash.update(chunk); callback(null, chunk); } });
  await pipeline(Readable.fromWeb(response.body), hashing, fs.createWriteStream(temporary));
  await rename(temporary, destination);
  const info = await stat(destination);
  if (info.size !== metadata.size) throw new Error(`Backup size mismatch for ${id}: ${info.size} != ${metadata.size}`);
  manifest.files.push({ id, displayName: metadata.display_name, bytes: info.size, sha256: hash.digest("hex"), localPath: destination });
}
await writeFile(path.join(outputDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(JSON.stringify({ status: "passed", outputDir, files: manifest.files.length, bytes: manifest.files.reduce((sum, file) => sum + file.bytes, 0) }, null, 2));
