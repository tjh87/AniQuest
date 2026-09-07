import assert from "node:assert/strict";
import test, { after } from "node:test";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const root = fileURLToPath(new URL("..", import.meta.url));
globalThis.__adminTestHeaders = new Headers();
globalThis.__adminTestEnv = {};
const vite = await createServer({ configFile: false, root, server: { middlewareMode: true, hmr: false }, plugins: [{
  name: "admin-test-runtime", enforce: "pre",
  transform(code, id) {
    if (!/\/app\/(admin-auth|chatgpt-auth)\.ts$/.test(id.replaceAll("\\", "/"))) return;
    return code.replace('"cloudflare:workers"', '"test-admin-env"').replace('"next/headers"', '"test-admin-headers"').replace('"next/navigation"', '"test-admin-navigation"');
  },
  resolveId(id) { if (id.startsWith("test-admin-")) return `\0${id}`; },
  load(id) {
    if (id === "\0test-admin-env") return 'export const env = globalThis.__adminTestEnv;';
    if (id === "\0test-admin-headers") return 'export const headers = async () => globalThis.__adminTestHeaders;';
    if (id === "\0test-admin-navigation") return 'export function notFound(){throw new Error("denied-404")} export function redirect(url){throw new Error("redirect:"+url)}';
  },
}] });
after(async () => { await vite.close(); delete globalThis.__adminTestHeaders; delete globalThis.__adminTestEnv; });
const { getAdminUser, requireAdminUser } = await vite.ssrLoadModule("/app/admin-auth.ts");
test("the real admin guard denies anonymous and ordinary users and defaults to deny", async () => {
  assert.equal(await getAdminUser(), null);
  await assert.rejects(requireAdminUser(), /redirect:.*signin-with-chatgpt/);
  globalThis.__adminTestHeaders = new Headers({ "oai-authenticated-user-id": "learner", "oai-authenticated-user-email": "learner@example.test" });
  assert.equal(await getAdminUser(), null);
  await assert.rejects(requireAdminUser(), /denied-404/);
  globalThis.__adminTestEnv.ANIQUEST_ADMIN_EMAIL = "owner@example.test";
  assert.equal(await getAdminUser(), null);
  await assert.rejects(requireAdminUser(), /denied-404/);
  globalThis.__adminTestHeaders = new Headers({ "oai-authenticated-user-id": "owner", "oai-authenticated-user-email": "owner@example.test" });
  assert.equal((await requireAdminUser()).email, "owner@example.test");
});
