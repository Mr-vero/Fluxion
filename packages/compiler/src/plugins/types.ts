import * as t from '@babel/types';
import { Platform } from '../types';

export interface CompilerPlugin {
  name: string;
  platform: Platform | 'universal';
  visitor: {
    [key: string]: (path: any) => void;
  };
  setup?: () => Promise<void>;
  cleanup?: () => Promise<void>;
} 