import { FluxionComponent } from '@fluxion/core';
import { BaseProps } from '../../types';

export interface CardProps extends BaseProps {
  title?: string;
  subtitle?: string;
  elevated?: boolean;
  padding?: boolean;
}

export class Card extends FluxionComponent<CardProps> {
  static defaultProps = {
    elevated: false,
    padding: true
  };

  private getClassNames(): string {
    const { elevated, padding } = this.props;
    return [
      'fx-card',
      elevated && 'fx-card--elevated',
      padding && 'fx-card--padded'
    ].filter(Boolean).join(' ');
  }

  render() {
    const { title, subtitle, children, testId } = this.props;

    return {
      type: 'div',
      props: {
        className: this.getClassNames(),
        'data-testid': testId
      },
      children: [
        title && {
          type: 'div',
          props: { className: 'fx-card__title' },
          children: title
        },
        subtitle && {
          type: 'div',
          props: { className: 'fx-card__subtitle' },
          children: subtitle
        },
        {
          type: 'div',
          props: { className: 'fx-card__content' },
          children
        }
      ]
    };
  }
} 