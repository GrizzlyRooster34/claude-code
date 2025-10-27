let active = 0;
const MAX_ACTIVE = parseInt(process.env.SEVEN_MAX_ACTIVE || "4", 10);
const MAX_TOKENS = parseInt(process.env.SEVEN_MAX_TOKENS || "32000", 10);

export function canStartTask() { return active < MAX_ACTIVE; }
export function onTaskStart() { active++; }
export function onTaskEnd() { active = Math.max(0, active-1); }
export function capTokens(n: number) { return Math.min(n, MAX_TOKENS); }
