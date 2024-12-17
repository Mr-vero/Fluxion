export type Platform = 'web' | 'mobile' | 'desktop';

export interface CompilerOptions {
  platform: Platform;
  mode: 'development' | 'production';
  optimize?: boolean;
  sourceMaps?: boolean;
}

export interface CompileResult {
  code: string;
  map?: string;
  platform: Platform;
  dependencies: string[];
}

export interface ComponentMetadata {
  name: string;
  platform: Platform | 'universal';
  props: Record<string, string>;
  hasSSR: boolean;
} 