import crypto from "crypto";
import fs from "fs";
import path from "path";
import { TERMUX_PREFIX } from "./paths";

const DIR = process.env.SEVEN_VAULT_DIR || `${TERMUX_PREFIX}/var/seven`;
const FILE = path.join(DIR, "vault.json.enc");

type VaultData = {
  // per agent secrets
  [agent: string]: {
    api_key?: string;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number; // epoch
    meta?: any;
  }
};

function deriveKey(pass: string, salt: Buffer) {
  return crypto.scryptSync(pass, salt, 32);
}

function requirePassphrase(): string {
  const p = process.env.SEVEN_VAULT_PASSPHRASE;
  if (!p) throw new Error("SEVEN_VAULT_PASSPHRASE not set");
  return p;
}

export function readVault(): VaultData {
  try {
    const buf = fs.readFileSync(FILE);
    const salt = buf.subarray(0, 16);
    const iv   = buf.subarray(16, 28);
    const tag  = buf.subarray(buf.length - 16);
    const enc  = buf.subarray(28, buf.length - 16);
    const key  = deriveKey(requirePassphrase(), salt);

    const dec = crypto.createDecipheriv("aes-256-gcm", key, iv);
    dec.setAuthTag(tag);
    const json = Buffer.concat([dec.update(enc), dec.final()]).toString("utf8");
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export function writeVault(data: VaultData) {
  const salt = crypto.randomBytes(16);
  const iv   = crypto.randomBytes(12);
  const key  = deriveKey(requirePassphrase(), salt);
  const enc  = crypto.createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.from(JSON.stringify(data));
  const out  = Buffer.concat([enc.update(body), enc.final()]);
  const tag  = enc.getAuthTag();
  const file = Buffer.concat([salt, iv, out, tag]);
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(FILE, file);
}

export function setSecret(agent: string, patch: Partial<VaultData[string]>) {
  const v = readVault(); v[agent] = { ...(v[agent]||{}), ...patch }; writeVault(v); return v[agent];
}
export function getSecret(agent: string) { const v = readVault(); return v[agent]; }
export function listAgentsWithSecrets(): string[] { return Object.keys(readVault()); }
