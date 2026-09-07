import assert from "node:assert/strict";
import { request } from "node:http";
import { mkdtemp, mkdir, writeFile, copyFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { test } from "node:test";
import { createLocalServer, checkRuntime } from "../scripts/serve-local.mjs";

const run = promisify(execFile);

async function fixture(t) {
  const folder = await mkdtemp(path.join(tmpdir(), "aniquest windows path "));
  const root = path.join(folder, "dist-local");
  await mkdir(path.join(root, "assets"), { recursive: true });
  await writeFile(path.join(root, "index.html"), "<!doctype html><title>AniQuest</title>");
  await writeFile(path.join(root, "assets", "app.js"), "console.log('AniQuest');");
  await writeFile(path.join(root, "assets", "photo.webp"), Buffer.from([82, 73, 70, 70]));
  await writeFile(path.join(folder, "private.txt"), "private source");
  const server = await createLocalServer({ root });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(async () => {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
    await rm(folder, { recursive: true, force: true });
  });
  const get = (pathname, options = {}) => new Promise((resolve, reject) => {
    const req = request({ hostname: "127.0.0.1", port: server.address().port, path: pathname, ...options }, (response) => {
      const chunks = [];
      response.on("data", (chunk) => chunks.push(chunk));
      response.on("end", () => resolve({ status: response.statusCode, headers: response.headers, body: Buffer.concat(chunks) }));
    });
    req.on("error", reject);
    req.end();
  });
  return { folder, root, server, get };
}

test("local app and binary assets work from a folder with spaces", async (t) => {
  const { get, server } = await fixture(t);
  assert.equal(server.address().address, "127.0.0.1");
  for (const url of ["/", "/index.html", "/?theme=dark", "/room", "/room/settings"]) {
    const response = await get(url);
    assert.equal(response.status, 200, url);
    assert.match(response.body.toString(), /AniQuest/);
    assert.match(response.headers["content-type"], /text\/html/);
  }
  const js = await get("/assets/app.js?v=1");
  assert.equal(js.status, 200);
  assert.match(js.headers["content-type"], /javascript/);
  assert.equal(js.headers["x-content-type-options"], "nosniff");
  assert.equal(js.headers["cache-control"], "no-store");
  const photo = await get("/assets/photo.webp");
  assert.equal(photo.headers["content-type"], "image/webp");
  assert.deepEqual(photo.body, Buffer.from([82, 73, 70, 70]));
  const head = await get("/assets/photo.webp", { method: "HEAD" });
  assert.equal(head.status, 200);
  assert.equal(head.headers["content-length"], "4");
  assert.equal(head.body.length, 0);
});

test("missing assets and server APIs do not receive a false app page", async (t) => {
  const { get } = await fixture(t);
  for (const url of ["/assets/missing.js", "/api/progress", "/api/admin/settings", "/assets/", "/package.json"]) {
    assert.equal((await get(url)).status, 404, url);
  }
  const post = await get("/api/progress", { method: "POST" });
  assert.equal(post.status, 405);
  assert.equal(post.headers.allow, "GET, HEAD");
});

test("paths cannot escape the build or use Windows alternate file paths", async (t) => {
  const { get } = await fixture(t);
  for (const url of [
    "/../private.txt", "/%2e%2e/private.txt", "/assets/../../private.txt", "/assets%5c..%5c..%5cprivate.txt",
    "/C:/Windows/win.ini", "//server/share/file", "/index.html::$DATA", "/index.html.", "/index.html%20",
    "/.env", "/.git/config", "/index.html%00", "/%00/", "/.%20/private.txt",
  ]) {
    assert.equal((await get(url)).status, 404, url);
  }
  assert.equal((await get("/%ZZ")).status, 400);
});

test("a symlink cannot expose a file outside the build", async (t) => {
  const { folder, root, get } = await fixture(t);
  try {
    await symlink(path.join(folder, "private.txt"), path.join(root, "leak.html"));
  } catch (error) {
    if (error.code === "EPERM") return t.skip("This Windows account cannot create symbolic links.");
    throw error;
  }
  assert.equal((await get("/leak.html")).status, 404);
});

test("untrusted Host headers are refused", async (t) => {
  const { get } = await fixture(t);
  assert.equal((await get("/", { headers: { Host: "untrusted.example" } })).status, 403);
});

test("runtime checks and the launcher do not need node_modules or the current folder", async (t) => {
  checkRuntime("22.13.0");
  checkRuntime("24.0.0");
  assert.throws(() => checkRuntime("20.19.0"), /Node.js 22/);
  assert.throws(() => checkRuntime("22.12.0"), /Node.js 22/);
  const { folder } = await fixture(t);
  const scripts = path.join(folder, "scripts");
  await mkdir(scripts);
  const launcher = path.join(scripts, "serve-local.mjs");
  await copyFile(new URL("../scripts/serve-local.mjs", import.meta.url), launcher);
  const result = await run(process.execPath, [launcher, "--check"], { cwd: tmpdir() });
  assert.match(result.stdout, /is ready for AniQuest/);
  await assert.rejects(createLocalServer({ root: path.join(folder, "missing-build") }), { code: "ENOENT" });
});
