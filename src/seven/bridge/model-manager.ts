import fs from "fs";
import { EventEmitter } from "node:events";

const ENV_PATH = process.env.ENV_PATH || ".env";
const DEFAULT = process.env.GEMINI_MODEL || "gemini-1.5-flash";

type State = {
  active: string;     // effective model
  pinned?: string;    // if set, ignore auto-upgrades
};
const emitter = new EventEmitter();
let state: State = { active: DEFAULT };

export function getModel(): State { return state; }

export function setModel(newModel: string, { pin=false } = {}) {
  state.active = newModel;
  state.pinned = pin ? newModel : undefined;
  emitter.emit("change", { ...state });
}

export function onModelChange(cb: (s:State)=>void) { emitter.on("change", cb); }

// Hot-reload from .env (optional: debounce if noisy)
export function startEnvWatch() {
  if (!fs.existsSync(ENV_PATH)) return;
  let last = "";
  const read = () => {
    try {
      const txt = fs.readFileSync(ENV_PATH, "utf8");
      if (txt === last) return;
      last = txt;
      const m = txt.match(/^\s*GEMINI_MODEL\s*=\s*"?([^"]\n\r]+)"?\s*$/m);
      const envModel = m ? m[1].trim() : undefined;
      if (envModel && !state.pinned && envModel !== state.active) {
        state.active = envModel;
        emitter.emit("change", { ...state });
      }
    } catch {/* ignore */}
  };
  read();
  fs.watch(ENV_PATH, { persistent: false }, read);
}
