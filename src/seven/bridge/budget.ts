import { setFuelPartial, getFuel } from "./fuel";

// Call this from a cron or Cloud Run job when spend > threshold
export function setConservativeMode(on: boolean) {
  const f = getFuel();
  if (on) {
    setFuelPartial({ vertexRate: Math.min(f.vertexRate ?? 1000, 50) });
  } else {
    setFuelPartial({ vertexRate: 1000 });
  }
}
