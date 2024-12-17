export interface ComponentProps {
  [key: string]: any;
}

export interface ComponentOptions {
  name: string;
  platform?: 'web' | 'mobile' | 'desktop' | 'universal';
  ssr?: boolean;
}

export abstract class FluxionComponent<P extends ComponentProps = {}> {
  protected props: P;
  protected options: ComponentOptions;

  constructor(props: P, options: ComponentOptions) {
    this.props = props;
    this.options = {
      ...options,
      platform: options.platform || 'universal',
      ssr: options.ssr ?? true
    };
  }

  abstract render(): any;

  /**
   * Lifecycle method called before component mounts
   */
  onMount?(): void | Promise<void>;

  /**
   * Lifecycle method called before component unmounts
   */
  onUnmount?(): void | Promise<void>;

  /**
   * AI-assisted optimization suggestions
   */
  async getOptimizationHints() {
    // This will be implemented to provide AI-driven optimization suggestions
    return [];
  }
} 