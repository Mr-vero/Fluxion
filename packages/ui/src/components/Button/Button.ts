import { FluxionComponent } from '@fluxion/core';
import { BaseProps, Size, Variant } from '../../types';

export interface ButtonProps extends BaseProps {
  size?: Size;
  variant?: Variant;
  fullWidth?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export class Button extends FluxionComponent<ButtonProps> {
  static defaultProps = {
    size: 'md' as Size,
    variant: 'primary' as Variant,
    fullWidth: false,
    type: 'button',
    disabled: false,
    loading: false
  };

  private getClassNames(): string {
    const { size, variant, fullWidth, disabled, loading } = this.props;
    return [
      'fx-button',
      `fx-button--${size}`,
      `fx-button--${variant}`,
      fullWidth && 'fx-button--full-width',
      disabled && 'fx-button--disabled',
      loading && 'fx-button--loading'
    ].filter(Boolean).join(' ');
  }

  render() {
    const { children, onClick, type, disabled, loading, testId } = this.props;

    return {
      type: 'button',
      props: {
        className: this.getClassNames(),
        onClick,
        type,
        disabled: disabled || loading,
        'data-testid': testId
      },
      children: loading ? [
        { type: 'span', props: { className: 'fx-button__spinner' } },
        children
      ] : children
    };
  }
} 