// Boots Seven core at daemon start: initializes memory + consciousness framework
import { initializeMemory } from "./seven/core/memory/api";
import { ConsciousnessEvolutionFrameworkV4 } from "./seven/core/consciousness-v4/ConsciousnessEvolutionFrameworkV4";

let booted = false;
export async function bootSeven(): Promise<void> {
  if (booted) return;
  await initializeMemory();
  const cef = new ConsciousnessEvolutionFrameworkV4();
  if (typeof (cef as any).initialize === "function") {
    await (cef as any).initialize();
  }
  booted = true;
  try { console.log("[seven] core initialized"); } catch {}
}
