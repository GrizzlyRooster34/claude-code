export function evaluate(text: string, rules: { must?: string[], maxLen?: number } = {}): boolean {
  const low = text.toLowerCase();
  if (rules.must && !rules.must.every(k => low.includes(k.toLowerCase()))) return false;
  if (rules.maxLen && text.length > rules.maxLen) return false;
  return true;
}
