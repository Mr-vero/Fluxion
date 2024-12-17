import { parse } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import { transformFromAstSync } from '@babel/core';
import { CompilerOptions, CompileResult, ComponentMetadata } from './types';

export class FluxionCompiler {
  private options: CompilerOptions;

  constructor(options: CompilerOptions) {
    this.options = {
      optimize: true,
      sourceMaps: true,
      ...options
    };
  }

  /**
   * Compile source code for the target platform
   */
  async compile(source: string): Promise<CompileResult> {
    // Parse the source code into an AST
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['typescript', 'jsx']
    });

    // Extract component metadata
    const metadata = this.extractMetadata(ast);

    // Transform the AST for the target platform
    const transformed = await this.transform(ast, metadata);

    // Generate the final code
    const result = transformFromAstSync(transformed, source, {
      sourceMaps: this.options.sourceMaps,
      configFile: false
    });

    if (!result?.code) {
      throw new Error('Compilation failed');
    }

    return {
      code: result.code,
      map: result.map?.toString(),
      platform: this.options.platform,
      dependencies: this.extractDependencies(ast)
    };
  }

  /**
   * Extract metadata from component definitions
   */
  private extractMetadata(ast: t.File): ComponentMetadata[] {
    const metadata: ComponentMetadata[] = [];

    traverse(ast, {
      ClassDeclaration(path) {
        const superClass = path.node.superClass;
        if (t.isIdentifier(superClass) && superClass.name === 'FluxionComponent') {
          const decorators = path.node.decorators || [];
          const platformDecorator = decorators.find(d => 
            t.isIdentifier(d.expression) && 
            d.expression.name === 'Platform'
          );

          metadata.push({
            name: path.node.id?.name || 'AnonymousComponent',
            platform: platformDecorator ? 'universal' : 'web',
            props: {},
            hasSSR: true // Default to true, can be overridden by decorators
          });
        }
      }
    });

    return metadata;
  }

  /**
   * Transform AST for target platform
   */
  private async transform(ast: t.File, metadata: ComponentMetadata[]): Promise<t.File> {
    // Platform-specific transformations
    switch (this.options.platform) {
      case 'web':
        return this.transformForWeb(ast);
      case 'mobile':
        return this.transformForMobile(ast);
      case 'desktop':
        return this.transformForDesktop(ast);
      default:
        return ast;
    }
  }

  /**
   * Transform code for web platform
   */
  private async transformForWeb(ast: t.File): Promise<t.File> {
    traverse(ast, {
      // Transform JSX to DOM operations
      JSXElement(path) {
        const element = path.node;
        // Transform JSX to createElement calls
        // This is a simplified example
        path.replaceWith(
          t.callExpression(
            t.identifier('createElement'),
            [
              t.stringLiteral(element.openingElement.name.toString()),
              t.objectExpression([])
            ]
          )
        );
      }
    });

    return ast;
  }

  /**
   * Transform code for mobile platform
   */
  private async transformForMobile(ast: t.File): Promise<t.File> {
    traverse(ast, {
      // Transform JSX to React Native components
      JSXElement(path) {
        const element = path.node;
        const name = element.openingElement.name;
        
        // Map HTML elements to React Native components
        if (t.isJSXIdentifier(name)) {
          switch (name.name.toLowerCase()) {
            case 'div':
              name.name = 'View';
              break;
            case 'span':
              name.name = 'Text';
              break;
            // Add more mappings as needed
          }
        }
      }
    });

    return ast;
  }

  /**
   * Transform code for desktop platform
   */
  private async transformForDesktop(ast: t.File): Promise<t.File> {
    // Similar to mobile transformations but for desktop-specific components
    return ast;
  }

  /**
   * Extract dependencies from import statements
   */
  private extractDependencies(ast: t.File): string[] {
    const dependencies: string[] = [];

    traverse(ast, {
      ImportDeclaration(path) {
        dependencies.push(path.node.source.value);
      }
    });

    return dependencies;
  }
} 