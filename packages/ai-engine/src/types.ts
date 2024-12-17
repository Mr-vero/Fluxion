export interface AIEngineConfig {
  apiKey: string;
  model?: 'gemini-pro' | 'gemini-pro-vision';
  temperature?: number;
  maxTokens?: number;
}

export interface CodeGenerationRequest {
  prompt: string;
  context?: string;
  language?: string;
  framework?: string;
}

export interface OptimizationRequest {
  code: string;
  context?: string;
  target?: 'performance' | 'size' | 'readability';
}

export interface AIResponse {
  code: string;
  explanation?: string;
  suggestions?: string[];
} 