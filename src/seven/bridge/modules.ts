import fs from "fs";
import path from "path";

export type AuthMode = "local"|"api_key"|"oauth_device"|"gcp_adc";
export type ModuleSpec = {
  type: "api" | "local";
  entry: string;
  capabilities: string[];
  auth: { mode: AuthMode; issuer?: string; scopes?: string[]; env?: string };
  model?: { default?: string };
};
export type Modules = Record<string, ModuleSpec>;

let cache: Modules | null = null;
export function loadModules(): Modules {
  if (cache) return cache;
  const here = path.resolve(process.cwd(), "src/seven/bridge/modules.json");
  cache = JSON.parse(fs.readFileSync(here, "utf8"));
  return cache!;
}
export function findByCapability(cap: string): string[] {
  const mods = loadModules();
  return Object.entries(mods)
    .filter(([_, m]) => m.capabilities.includes(cap))
    .map(([name]) => name);
}
export function getModule(name: string): ModuleSpec | undefined {
  const mods = loadModules(); return mods[name];
}
