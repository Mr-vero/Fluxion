import { FluxionComponent } from '@fluxion/core';
import { BaseProps, Size } from '../../types';

export interface InputProps extends BaseProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: string;
  size?: Size;
  error?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

export class Input extends FluxionComponent<InputProps> {
  static defaultProps = {
    type: 'text',
    size: 'md' as Size
  };

  private getClassNames(): string {
    const { size, error, disabled } = this.props;
    return [
      'fx-input',
      `fx-input--${size}`,
      error && 'fx-input--error',
      disabled && 'fx-input--disabled'
    ].filter(Boolean).join(' ');
  }

  render() {
    const {
      value,
      defaultValue,
      placeholder,
      type,
      onChange,
      onFocus,
      onBlur,
      error,
      disabled,
      testId
    } = this.props;

    return {
      type: 'div',
      props: { className: 'fx-input-wrapper' },
      children: [
        {
          type: 'input',
          props: {
            className: this.getClassNames(),
            value,
            defaultValue,
            placeholder,
            type,
            disabled,
            onChange: (e: any) => onChange?.(e.target.value),
            onFocus,
            onBlur,
            'data-testid': testId
          }
        },
        error && {
          type: 'div',
          props: { className: 'fx-input__error' },
          children: error
        }
      ]
    };
  }
} 