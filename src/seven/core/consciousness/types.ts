export type PreplanInput = {
  prompt: string;
  system?: string;
  memories?: any[];
};

export type PreplanResult = {
  prompt: string;
  system: string;
  primer: string;
  memories: any[];
  meta?: Record<string, any>;
};

export type PostprocessInput = {
  input: PreplanResult;
  output: string;
  traceId?: string;
};

export type PostprocessResult = {
  memorySummary: string;
  refs: string[];
  meta?: Record<string, any>;
};
