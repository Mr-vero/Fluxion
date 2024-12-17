import { ThemeConfig, Size } from '../types';

const spacing: Record<Size, number> = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32
};

export const defaultTheme: ThemeConfig = {
  colorScheme: 'light',
  primaryColor: '#007AFF',
  secondaryColor: '#5856D6',
  fontFamily: 'system-ui, -apple-system, sans-serif',
  borderRadius: 4,
  spacing
};

export class ThemeProvider {
  private static instance: ThemeProvider;
  private currentTheme: ThemeConfig;

  private constructor() {
    this.currentTheme = defaultTheme;
  }

  static getInstance(): ThemeProvider {
    if (!ThemeProvider.instance) {
      ThemeProvider.instance = new ThemeProvider();
    }
    return ThemeProvider.instance;
  }

  getTheme(): ThemeConfig {
    return this.currentTheme;
  }

  setTheme(theme: Partial<ThemeConfig>) {
    this.currentTheme = {
      ...this.currentTheme,
      ...theme
    };
  }
} 