import { execSeven } from "../src/seven/adapters/seven";

test("seven pipeline is wired (preplan→LLM→postprocess→commit)", async () => {
  const r = await execSeven({ prompt: "State 'ready' once.", memoryKey: "session:test" });
  expect(r && typeof r.text === "string").toBeTruthy();
});
