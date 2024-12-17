export { AIEngine } from './engine';
export { CodeAnalyzer } from './analyzer';
export type {
  AIEngineConfig,
  CodeGenerationRequest,
  OptimizationRequest,
  AIResponse,
  AnalysisResult
} from './types';

// Create default AI engine instance
const defaultEngine = new AIEngine({
  apiKey: process.env.FLUXION_GEMINI_API_KEY || ''
});

export default defaultEngine; 