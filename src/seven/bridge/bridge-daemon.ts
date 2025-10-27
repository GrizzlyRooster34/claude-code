// SevenBridge Daemon: UNIX-socket NDJSON RPC
// Run with: bun run seven:daemon
import net from "net";
import fs from "fs";
import { v4 as uuid } from "uuid";

import { DEFAULT_SOCKET, ensureDirs } from "./paths";
import { cliLogin } from "./cli-auth";
import { getSecret, setSecret } from "./vault";
import { bootSeven } from "../../boot-seven";

// ...
case "cred.login": {
  const { agent } = data;
  try { const res = await cliLogin(agent); return write(socket, { id, result: { agent, ...res }}); }
  catch (e:any) { return write(socket, { id, error: String(e) }); }
}
case "cred.status": {
  const { agent } = data;
  const sec = getSecret(agent);
  const now = Math.floor(Date.now()/1000);
  const valid = !!(sec?.api_key || (sec?.access_token && (!sec.expires_at || sec.expires_at > now)));
  return write(socket, { id, result: { agent, valid, expires_at: sec?.expires_at || null }});
}
case "cred.refresh": {
  const { agent } = data;
  const m = getModule(agent); if (!m) return write(socket, { id, error: "unknown_agent" });
  const sec = getSecret(agent);
  const a: any = m.auth || {};
  if (!sec?.refresh_token || !a.tokenEndpoint || !a.clientId) return write(socket, { id, error: "no_refresh" });

  const tok = await fetch(a.tokenEndpoint, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: sec.refresh_token,
      client_id: a.clientId
    }).toString()
  }).then(r => r.json());

  if (tok.error) return write(socket, { id, error: `refresh_failed:${tok.error}` });
  const expires_at = Math.floor(Date.now()/1000) + (tok.expires_in || 3600);
  setSecret(agent, { access_token: tok.access_token, expires_at });
  return write(socket, { id, result: { agent, refreshed: true, expires_at }});
}
case "cred.revoke": {
  const { agent } = data;
  const sec = getSecret(agent);
  if (!sec) return write(socket, { id, result: { agent, revoked: false }});
  setSecret(agent, {} as any); // scrub entry
  return write(socket, { id, result: { agent, revoked: true }});
}

ensureDirs();

// prepare socket
const SOCKET = process.env.SEVEN_SOCKET || DEFAULT_SOCKET;
try { fs.unlinkSync(SOCKET); } catch (_) {}

const server = net.createServer(socket => {
  let buf = "";
  socket.on("data", d => {
    buf += d.toString();
    let idx;
    while ((idx = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, idx); buf = buf.slice(idx+1);
      if (!line.trim()) continue;
      let msg: any;
      try { msg = JSON.parse(line); } catch (e) { write(socket, { error: "bad_json" }); continue; }
      handle(msg, socket).catch(err => write(socket, { id: msg.id ?? null, error: String(err) }));
    }
  });
});

server.listen(SOCKET, () => {
  try { fs.chmodSync(SOCKET, 0o660); } catch {}
  log("daemon.ready", { socket: SOCKET });
  startEnvWatch();
  // Boot Seven core as the daemon comes up
  bootSeven().catch(e => log("daemon.boot.error", { error: String(e) }));
  onModelChange(s => log("model.change", s));
});

async function handle(msg: any, socket: net.Socket) {
  const id = msg.id ?? uuid();
  const { event, data = {} } = msg;

  switch (event) {
    case "heartbeat":       return write(socket, { id, result: { ok: true, ts: Date.now() }});
    case "fuel.get":        return write(socket, { id, result: getFuel() });
    case "fuel.patch":      return write(socket, { id, result: setFuelPartial(data) });
    case "memory.save":     return write(socket, { id, result: await saveMemory(data.key, data.summary, data.refs||[]) });

    case "model.get":       return write(socket, { id, result: getModel() });
    case "model.set":       setModel(data.model, { pin: !!data.pin }); return write(socket, { id, result: getModel() });

    case "routeTask":       return write(socket, { id, result: await routeTask(data) });

    case "handoff.request": return write(socket, { id, result: { accepted: true, ts: Date.now() }}); // extend with policy later

    case "stream.open":     openStream(data.taskId); return write(socket, { id, result: { opened: true }});
    case "stream.token":    writeToken(data.taskId, data.token, data.meta); return write(socket, { id, result: { ok: true }});
    case "stream.close":    closeStream(data.taskId); return write(socket, { id, result: { closed: true }});
    case "stream.get":      return write(socket, { id, result: lastTokens(data.taskId, data.n || 128) });

    default:                return write(socket, { id, error: "unknown_event", event });
  }
}

function write(socket: net.Socket, obj: any) { socket.write(JSON.stringify(obj) + "\n"); }
function log(event: string, data: any) { try { process.stdout.write(JSON.stringify({ event, ...data }) + "\n"); } catch {} }
