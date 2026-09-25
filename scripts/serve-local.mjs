import http from "node:http";
import { readFile, realpath, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawn } from "node:child_process";

const buildRoot = fileURLToPath(new URL("../dist-local/", import.meta.url));
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

export function checkRuntime(version = process.versions.node) {
  const [major, minor] = version.split(".").map(Number);
  if (major < 22 || (major === 22 && minor < 13)) {
    throw new Error("Install Node.js 22 LTS (22.13 or later), then start AniQuest again.");
  }
}

// Serve the built app only. Source files and server APIs are never exposed.
export async function createLocalServer({ root = buildRoot } = {}) {
  const directory = await realpath(root);
  await stat(path.join(directory, "index.html"));
  const server = http.createServer(async (request, response) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Cache-Control", "no-store");
    // Runtime assets cannot silently reach a CDN. Reference links still open normally.
    response.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self'; media-src 'self' blob:; object-src 'none'; frame-src 'none'; base-uri 'self'");
    const send = (status, message) => {
      response.writeHead(status, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(request.method === "HEAD" ? undefined : message);
    };
    const port = server.address()?.port;
    if (!["127.0.0.1:" + port, "localhost:" + port].includes(request.headers.host)) {
      send(403, "Use the local address printed in the AniQuest window.");
      return;
    }
    if (request.method !== "GET" && request.method !== "HEAD") {
      response.setHeader("Allow", "GET, HEAD");
      send(405, "This local edition does not provide server APIs.");
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent((request.url ?? "/").split("?")[0]);
    } catch {
      send(400, "Invalid address.");
      return;
    }
    const segments = pathname.split("/").filter(Boolean);
    if (!pathname.startsWith("/") || pathname.startsWith("//") || /[\\:\x00-\x1f\x7f]/.test(pathname)
      || segments.some((part) => part.startsWith(".") || /[. ]$/.test(part))) {
      send(404, "Page not found.");
      return;
    }
    const isAppRoute = pathname === "/" || pathname === "/room" || pathname.startsWith("/room/");
    const requestedFile = isAppRoute ? "index.html" : segments.join(path.sep);
    try {
      const filename = await realpath(path.resolve(directory, requestedFile));
      const relative = path.relative(directory, filename);
      if (relative.startsWith(".." + path.sep) || relative === ".." || path.isAbsolute(relative)) {
        send(404, "Page not found.");
        return;
      }
      const info = await stat(filename);
      if (!info.isFile() || !mimeTypes[path.extname(filename).toLowerCase()]) {
        send(404, "Page not found.");
        return;
      }
      const content = request.method === "HEAD" ? undefined : await readFile(filename);
      response.writeHead(200, {
        "Content-Type": mimeTypes[path.extname(filename).toLowerCase()],
        "Content-Length": info.size,
      });
      response.end(content);
    } catch (error) {
      send(error.code === "ENOENT" || error.code === "ENOTDIR" ? 404 : 500, "File unavailable.");
    }
  });
  return server;
}

function openBrowser(url) {
  // The URL is fixed by this launcher, never read from a request or shell input.
  const command = process.platform === "win32" ? "rundll32.exe" : process.platform === "darwin" ? "open" : "xdg-open";
  const args = process.platform === "win32" ? ["url.dll,FileProtocolHandler", url] : [url];
  const child = spawn(command, args, { detached: true, stdio: "ignore", windowsHide: true });
  child.on("error", () => console.log("Open the address above in your browser."));
  child.unref();
}

async function main() {
  checkRuntime();
  if (process.argv.includes("--check")) {
    console.log("Node.js " + process.versions.node + " is ready for AniQuest.");
    return;
  }
  const server = await createLocalServer();
  server.on("error", (error) => {
    console.error(error.code === "EADDRINUSE"
      ? "Port 5173 is in use. Close the other AniQuest window or app using this port, then try again."
      : "AniQuest could not start: " + error.message);
    process.exitCode = 1;
  });
  server.listen(5173, "127.0.0.1", () => {
    const url = "http://127.0.0.1:5173";
    console.log("AniQuest is ready: " + url);
    console.log("Keep this window open. Press Ctrl+C to stop.");
    if (process.argv.includes("--open")) openBrowser(url);
  });
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.once(signal, () => {
      server.close();
      server.closeAllConnections();
    });
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.code === "ENOENT"
      ? "The built app is missing. Extract the complete ZIP, or run Build-AniQuest.cmd."
      : error.message);
    process.exitCode = 1;
  });
}
