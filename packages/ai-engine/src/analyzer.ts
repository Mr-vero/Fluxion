import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';

export interface AnalysisResult {
  complexity: number;
  suggestions: string[];
  warnings: string[];
}

export class CodeAnalyzer {
  /**
   * Analyze code and provide optimization suggestions
   */
  analyze(code: string): AnalysisResult {
    const ast = parse(code, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    const result: AnalysisResult = {
      complexity: 0,
      suggestions: [],
      warnings: []
    };

    traverse(ast, {
      // Check for nested loops
      'ForStatement|WhileStatement|DoWhileStatement'(path) {
        path.traverse({
          'ForStatement|WhileStatement|DoWhileStatement'() {
            result.complexity++;
            result.suggestions.push(
              'Consider refactoring nested loops for better performance'
            );
          }
        });
      },

      // Check for large functions
      FunctionDeclaration(path) {
        if (path.node.body.body.length > 20) {
          result.warnings.push(
            `Function ${path.node.id?.name} is too large, consider breaking it down`
          );
        }
      },

      // Check for complex conditions
      LogicalExpression(path) {
        let complexity = 0;
        path.traverse({
          LogicalExpression() {
            complexity++;
          }
        });

        if (complexity > 3) {
          result.suggestions.push(
            'Consider simplifying complex logical expressions'
          );
        }
      }
    });

    return result;
  }
} 