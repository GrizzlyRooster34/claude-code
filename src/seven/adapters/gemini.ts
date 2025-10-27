import fetch from "node-fetch";
import { getAuthToken } from "./google-auth"; // factor out token logic
import { getModel } from "../bridge/model-manager";

export async function execGemini(data: { prompt: string }) {
  const project = process.env.GCLOUD_PROJECT!;
  const location = process.env.GCLOUD_REGION || "us-central1";
  const model = getModel().active; // <— dynamic
  const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${project}/locations/${location}/publishers/google/models/${model}:generateContent`;

  const token = await getAuthToken();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: data.prompt }]}] })
  });
  const out = await res.json();
  return out;
}
