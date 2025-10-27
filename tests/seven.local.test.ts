import { execSeven } from "../src/seven/adapters/seven";

test("seven local responds", async () => {
  const r = await execSeven({ prompt: "Reply with exactly: Hello Seven" });
  expect((r?.text || "").toLowerCase()).toContain("hello");
});
