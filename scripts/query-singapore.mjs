// Read public Singapore MCP tools through the installed stdio server.
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
const server = process.env.ANIQUEST_SINGAPORE_MCP;
if (!server) throw new Error('Set ANIQUEST_SINGAPORE_MCP to the installed server CLI.');
const child = spawn(process.execPath, [server], { stdio: ['pipe', 'pipe', 'inherit'], windowsHide: true });
const pending = new Map();
let id = 0;
createInterface({ input: child.stdout }).on('line', line => {
  const message = JSON.parse(line);
  if (pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
});
const request = (method, params) => new Promise(resolve => {
  const next = ++id;
  pending.set(next, resolve);
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: next, method, params }) + '\n');
});
const timeout = setTimeout(() => { child.kill(); process.exitCode = 1; }, 90000);
try {
  await request('initialize', { protocolVersion: '2024-11-05', capabilities: {}, clientInfo: { name: 'aniquest-research', version: '1.0' } });
  child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }) + '\n');
  const tool = process.argv[2];
  const result = await request(tool ? 'tools/call' : 'tools/list', tool ? { name: tool, arguments: JSON.parse(process.argv[3] || '{}') } : {});
  console.log(JSON.stringify(result));
} finally { clearTimeout(timeout); child.kill(); }
