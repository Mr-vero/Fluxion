export { FluxionCompiler } from './compiler';
export { CompilerPlugin } from './plugins/types';
export { OptimizerPlugin } from './plugins/optimizer';
export type { 
  CompilerOptions,
  CompileResult,
  ComponentMetadata,
  Platform
} from './types';

// Create default compiler instance
const defaultCompiler = new FluxionCompiler({
  platform: 'web',
  mode: 'development'
});

export default defaultCompiler; 