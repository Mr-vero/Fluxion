import { ComponentProps as FluxionComponentProps } from '@fluxion/core';

export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'tertiary';
export type ColorScheme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  colorScheme: ColorScheme;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  borderRadius: number;
  spacing: Record<Size, number>;
}

export interface StyleProps {
  className?: string;
  style?: Record<string, any>;
  theme?: Partial<ThemeConfig>;
}

export interface BaseProps extends FluxionComponentProps, StyleProps {
  id?: string;
  testId?: string;
  disabled?: boolean;
  loading?: boolean;
} 