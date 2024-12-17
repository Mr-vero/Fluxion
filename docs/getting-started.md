# Getting Started with Fluxion.js

Fluxion.js is a revolutionary framework that combines declarative UI development with AI-driven assistance.

## Installation

```bash
# Create a new Fluxion project
npx create-fluxion-app my-app

# Or add to existing project
npm install @fluxion/core @fluxion/ui @fluxion/state
```

## Basic Setup

```typescript
import { Fluxion } from '@fluxion/core';

// Initialize Fluxion
const app = new Fluxion({
  mode: 'development',
  platform: 'web',
  state: {
    persistence: true
  },
  ai: {
    enabled: true,
    apiKey: 'your-gemini-api-key'
  }
});
```

## Creating Components

```typescript
import { FluxionComponent } from '@fluxion/core';
import { Button } from '@fluxion/ui';

class MyComponent extends FluxionComponent {
  render() {
    return {
      type: 'div',
      props: { className: 'container' },
      children: [
        {
          type: Button,
          props: {
            variant: 'primary',
            onClick: () => console.log('Clicked!')
          },
          children: 'Click me'
        }
      ]
    };
  }
}
```

## State Management

```typescript
import { useStore } from '@fluxion/state';

class Counter extends FluxionComponent {
  private countStore = useStore('count', 0);

  render() {
    return {
      type: 'div',
      children: [
        {
          type: 'span',
          children: `Count: ${this.countStore.value}`
        },
        {
          type: Button,
          props: {
            onClick: () => this.countStore.set(count => count + 1)
          },
          children: 'Increment'
        }
      ]
    };
  }
}
```

## AI Features

```typescript
import { AIEngine } from '@fluxion/ai-engine';

const ai = new AIEngine({
  apiKey: 'your-gemini-api-key'
});

// Generate code
const result = await ai.generateCode({
  prompt: 'Create a login form component',
  framework: 'fluxion'
});

// Get optimization suggestions
const optimized = await ai.optimizeCode({
  code: existingCode,
  target: 'performance'
});
```

## Development Server

```bash
# Start development server
npm run dev

# Build for production
npm run build
```

## Key Features

- **Universal Rendering**: Write once, run anywhere (Web, Mobile, Desktop)
- **AI Assistance**: Code generation and optimization
- **Reactive State**: Simple and powerful state management
- **Zero Config**: Start coding immediately
- **Type Safety**: Built with TypeScript
- **Hot Reload**: Fast development cycle

## Next Steps

- [Core Concepts](./core-concepts.md)
- [Component Guide](./components.md)
- [State Management](./state-management.md)
- [AI Features](./ai-features.md)
- [API Reference](./api-reference/core.md)