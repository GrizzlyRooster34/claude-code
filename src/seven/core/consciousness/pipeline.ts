// Wire real consciousness pipeline into Seven v4
// NOTE: paths assume Gemini placed these modules during transplant.
import { ConsciousnessEvolutionFrameworkV4 } from "../consciousness-v4/ConsciousnessEvolutionFrameworkV4";
import { IdentitySynthesisEngine }            from "../consciousness-v4/IdentitySynthesisEngine";
import type { PreplanInput, PreplanResult, PostprocessInput, PostprocessResult } from "./types";

const cef    = new ConsciousnessEvolutionFrameworkV4();
const idSynth= new IdentitySynthesisEngine();

export async function preplan(input: PreplanInput): Promise<PreplanResult> {
  // 1) contextualize the prompt; 2) merge identity; 3) return plan (system+primer+prompt)
  const ctx      = await cef.prepareContext(input.prompt, { system: input.system, memories: input.memories });
  const identity = await idSynth.mergeContext(ctx);
  return {
    prompt: ctx.prompt,
    system: identity.system ?? input.system ?? "",
    primer: identity.primer ?? "",
    memories: input.memories ?? [],
    meta: { stage: "preplan", ctx: ctx.meta ?? {} }
  };
}

export async function postprocess(data: PostprocessInput): Promise<PostprocessResult> {
  // Integrate model output into consciousness state; produce memory summary + refs
  const integ = await cef.integrateResponse(data.output, data.traceId);
  return {
    memorySummary: integ.memorySummary ?? (data.output || "").slice(0, 280),
    refs: integ.refs ?? [],
    meta: { stage: "postprocess", ...integ.meta }
  };
}
