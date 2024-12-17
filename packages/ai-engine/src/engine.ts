import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';
import { AIEngineConfig, CodeGenerationRequest, OptimizationRequest, AIResponse } from './types';

export class AIEngine {
  private model: GenerativeModel;
  private config: AIEngineConfig;

  constructor(config: AIEngineConfig) {
    this.config = {
      model: 'gemini-pro',
      temperature: 0.7,
      maxTokens: 2048,
      ...config
    };

    const genAI = new GoogleGenerativeAI(this.config.apiKey);
    this.model = genAI.getGenerativeModel({ model: this.config.model });
  }

  /**
   * Generate code based on natural language prompt
   */
  async generateCode(request: CodeGenerationRequest): Promise<AIResponse> {
    const prompt = this.buildGenerationPrompt(request);

    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      }
    });

    const response = result.response;
    if (!response.text()) {
      throw new Error('Failed to generate code');
    }

    return this.parseAIResponse(response.text());
  }

  /**
   * Optimize existing code
   */
  async optimizeCode(request: OptimizationRequest): Promise<AIResponse> {
    const prompt = this.buildOptimizationPrompt(request);

    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      }
    });

    const response = result.response;
    if (!response.text()) {
      throw new Error('Failed to optimize code');
    }

    return this.parseAIResponse(response.text());
  }

  /**
   * Generate component suggestions based on context
   */
  async suggestComponents(context: string): Promise<string[]> {
    const result = await this.model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [{ text: `Based on this context, suggest appropriate UI components:\n${context}` }]
        }
      ],
      generationConfig: {
        temperature: this.config.temperature,
        maxOutputTokens: this.config.maxTokens,
      }
    });

    const response = result.response;
    if (!response.text()) {
      return [];
    }

    return response.text().split('\n').filter(Boolean);
  }

  private buildGenerationPrompt(request: CodeGenerationRequest): string {
    return `
You are an expert programmer. Please generate code with the following requirements:

${request.prompt}

${request.context ? `Context:\n${request.context}` : ''}
${request.language ? `Language: ${request.language}` : ''}
${request.framework ? `Framework: ${request.framework}` : ''}

Please provide your response in the following format:
1. Implementation code (in a code block)
2. Brief explanation of the implementation
3. Additional suggestions or considerations
    `.trim();
  }

  private buildOptimizationPrompt(request: OptimizationRequest): string {
    return `
You are an expert code optimizer. Please optimize the following code for ${request.target || 'performance'}:

${request.code}

${request.context ? `Context:\n${request.context}` : ''}

Please provide your response in the following format:
1. Optimized code (in a code block)
2. Explanation of the optimizations made
3. Additional optimization suggestions
    `.trim();
  }

  private parseAIResponse(response: string): AIResponse {
    // Split response into sections based on numbered format
    const sections = response.split(/\d+\.\s+/).filter(Boolean);
    
    return {
      code: this.extractCodeBlock(sections[0] || ''),
      explanation: sections[1]?.trim(),
      suggestions: sections[2]?.split('\n').filter(Boolean) || []
    };
  }

  private extractCodeBlock(text: string): string {
    // Extract code between ``` markers
    const match = text.match(/```(?:\w+)?\n([\s\S]*?)```/);
    return match ? match[1].trim() : text.trim();
  }
} 