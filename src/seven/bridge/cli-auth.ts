import fetch from "node-fetch";
import crypto from "crypto";
import { setSecret } from "./vault";
import { getModule } from "./modules";

// Termux-friendly "open URL"
function openUrl(url: string) {
  const { spawnSync } = require("child_process");
  // Try termux-open-url; fallback to printing
  const r = spawnSync("termux-open-url", [url], { stdio: "ignore" });
  if (r.status !== 0) {
    console.log("\nOpen this URL in a browser:\n" + url + "\n");
  }
}

async function promptLine(mask = false, label = "Paste token: "): Promise<string> {
  const readline = require("readline");
  return await new Promise<string>((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    if (!mask) {
      rl.question(label, (ans: string) => { rl.close(); resolve(ans.trim()); });
    } else {
      // basic masked input
      (rl as any).output.write(label);
      const input: string[] = [];
      (rl.input as any).on("data", (c: Buffer) => {
        const s = c.toString("utf8");
        if (s === "\n" || s === "\r" || s === "\u0004") {
          rl.close(); (rl as any).output.write("\n"); resolve(input.join(""));
        } else if (s === "\u0008" || s === "\u007f") { input.pop(); }
        else { input.push(s); }
      });
    }
  });
}

// === Flows ===

// 1) API KEY (copy/paste from dashboard)
async function flowApiKey(agent: string, loginUrl?: string, envName?: string) {
  if (loginUrl) openUrl(loginUrl);
  const key = await promptLine(true, `Paste ${agent} API key: `);
  if (!key) throw new Error("No API key provided");
  setSecret(agent, { api_key: key, expires_at: undefined });
  if (envName) process.env[envName] = key;
  return { ok: true, mode: "api_key" };
}

// 2) OAuth Device Flow (copy/paste URL+code)
async function flowDevice(agent: string, issuer: string, clientId: string, scope: string, tokenEndpoint?: string) {
  // discovery
  let disc: any = {};
  try {
    const r = await fetch(`${issuer}/.well-known/openid-configuration`);
    disc = await r.json();
  } catch {}
  const deviceEp = disc.device_authorization_endpoint || `${issuer}/oauth/device/code`;
  const tokenEp  = tokenEndpoint || disc.token_endpoint;

  // start
  const start = await fetch(deviceEp, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: clientId, scope }).toString()
  }).then(r => r.json());

  const verifyUrl = start.verification_uri_complete || start.verification_uri;
  if (verifyUrl) openUrl(verifyUrl);
  console.log(`\n== ${agent} Device Login ==\nCode: ${start.user_code}\nURL: ${verifyUrl}\n`);

  // poll
  const intervalMs = ((start.interval as number) || 5) * 1000;
  while (true) {
    await new Promise(res => setTimeout(res, intervalMs));
    const token = await fetch(tokenEp, {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:device_code",
        device_code: start.device_code, client_id: clientId
      }).toString()
    }).then(r => r.json());

    if (token.error === "authorization_pending") continue;
    if (token.error) throw new Error(`OAuth error: ${token.error}`);

    const expires_at = Math.floor(Date.now()/1000) + (token.expires_in || 3600);
    setSecret(agent, {
      access_token: token.access_token,
      refresh_token: token.refresh_token,
      expires_at,
      meta: { scope, issuer, token_endpoint: tokenEp }
    });
    return { ok: true, mode: "oauth_device" };
  }
}

// 3) OAuth PKCE (copy/paste code grant — no loopback listener)
function base64url(b: Buffer) { return b.toString("base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,""); }
async function flowPkce(agent: string, issuer: string, clientId: string, scope: string, tokenEndpoint?: string) {
  let disc: any = {};
  try { disc = await (await fetch(`${issuer}/.well-known/openid-configuration`)).json(); } catch {}
  const authEp  = disc.authorization_endpoint || `${issuer}/oauth/authorize`;
  const tokenEp = tokenEndpoint || disc.token_endpoint;

  // PKCE
  const verifier = base64url(crypto.randomBytes(32));
  const challenge = base64url(crypto.createHash("sha256").update(verifier).digest());
  const state = base64url(crypto.randomBytes(12));

  // Build auth URL with manual copy-paste code flow
  const redirect = "urn:ietf:wg:oauth:2.0:oob"; // out-of-band — user will paste code
  const url = new URL(authEp);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirect);
  url.searchParams.set("scope", scope);
  url.searchParams.set("code_challenge", challenge);
  url.searchParams.set("code_challenge_method", "S256");
  url.searchParams.set("state", state);

  openUrl(url.toString());
  const code = await promptLine(false, `Paste ${agent} authorization code: `);
  if (!code) throw new Error("No authorization code provided");

  // Exchange
  const tok = await fetch(tokenEp, {
    method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code, client_id: clientId,
      redirect_uri: redirect,
      code_verifier: verifier
    }).toString()
  }).then(r => r.json());

  if (tok.error) throw new Error(`OAuth error: ${tok.error}`);

  const expires_at = Math.floor(Date.now()/1000) + (tok.expires_in || 3600);
  setSecret(agent, {
    access_token: tok.access_token,
    refresh_token: tok.refresh_token,
    expires_at,
    meta: { scope, issuer, token_endpoint: tokenEp }
  });
  return { ok: true, mode: "pkce" };
}

// Public entry: generic
export async function cliLogin(agent: string) {
  const m = getModule(agent);
  if (!m) throw new Error("Unknown agent");
  const a: any = m.auth || {};
  switch (a.mode) {
    case "api_key":
    case "cli_login":  // same UX for key-based dashboards
      return await flowApiKey(agent, a.loginUrl, a.env);
    case "oauth_device":
      return await flowDevice(agent, a.issuer, a.clientId, (a.scopes||[]).join(" "), a.tokenEndpoint);
    case "pkce":
      return await flowPkce(agent, a.issuer, a.clientId, (a.scopes||[]).join(" "), a.tokenEndpoint);
    default:
      throw new Error(`Unsupported auth mode: ${a.mode}`);
  }
}
