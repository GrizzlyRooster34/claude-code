// Wire Memory-v3-Amalgum
import { TemporalPersonalityEngine } from "../memory-v3-amalgum/TemporalPersonalityEngine";
import { CanonicalIngestion }        from "../memory-v3-amalgum/CanonicalIngestion";
import { ContextReinstatement }      from "../memory-v3-amalgum/ContextReinstatement";

const tpe = new TemporalPersonalityEngine();
const ingest = new CanonicalIngestion();
const reinstate = new ContextReinstatement();

export async function initializeMemory(): Promise<void> {
  if (typeof (tpe as any).initialize === "function") {
    await (tpe as any).initialize();
  }
}

export async function recall(key: string): Promise<any[]> {
  const episodic = await tpe.recall(key);
  const reinstated = await reinstate.restore(episodic);
  return reinstated;
}

export async function commit(key: string, summary: string, refs: string[] = []): Promise<void> {
  const canonical = await ingest.ingest({ key, summary, refs, ts: Date.now() });
  await tpe.commit(key, canonical);
}
