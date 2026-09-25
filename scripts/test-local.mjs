import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
// The Worker-render test needs its separate hosted build. All other tests use local fixtures.
const files = (await readdir(new URL("../tests/", import.meta.url)))
  .filter(name => name.endsWith(".test.mjs") && name !== "rendered-html.test.mjs")
  .sort().map(name => `tests/${name}`);
const result = spawnSync(process.execPath, ["--test", "--test-concurrency=1", ...files], { cwd: root, stdio: "inherit" });
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
