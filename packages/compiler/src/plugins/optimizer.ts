import { CompilerPlugin } from './types';
import * as t from '@babel/types';

export class OptimizerPlugin implements CompilerPlugin {
  name = 'FluxionOptimizer';
  platform = 'universal';

  visitor = {
    // Remove unused imports
    ImportDeclaration(path: any) {
      const binding = path.scope.getBinding(path.node.specifiers[0]?.local?.name);
      if (!binding?.referenced) {
        path.remove();
      }
    },

    // Convert string concatenation to template literals
    BinaryExpression(path: any) {
      if (path.node.operator === '+' && 
          (t.isStringLiteral(path.node.left) || t.isStringLiteral(path.node.right))) {
        path.replaceWith(
          t.templateLiteral(
            [
              t.templateElement({ raw: path.node.left.value }),
              t.templateElement({ raw: path.node.right.value }, true)
            ],
            []
          )
        );
      }
    }
  };
} 