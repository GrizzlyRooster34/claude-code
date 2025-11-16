import { lastTokens } from "./stream";
import { send } from "./bridge"; // your existing client used inside Claude runtime

export async function requestHandoff(to: string, taskId: string, context: any) {
  const overlap = lastTokens(taskId, 128).join("");
  return await send("handoff.request", { to, taskId, context, overlap });
}
