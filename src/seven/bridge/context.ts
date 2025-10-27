export type ContextObject = {
  id: string;
  origin: string;
  short: string;
  refs?: string[];
  timestamp: string;
  metadata?: Record<string, any>;
};
