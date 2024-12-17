# Fluxion Todo App Example

This example demonstrates key features of Fluxion.js including:

- Component composition
- State management
- UI components
- Event handling
- Persistence

## Running the Example

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Project Structure

```
src/
├── components/
│   └── TodoApp.ts    # Main todo app component
├── styles.css        # App styles
└── index.ts         # App entry point
```

## Key Concepts Demonstrated

1. **Components**: Using FluxionComponent to create reusable UI components
   ```typescript
   class TodoApp extends FluxionComponent {
     render() {
       return {
         type: Card,
         props: { title: 'Todo App' },
         children: [/* ... */]
       };
     }
   }
   ```

2. **State Management**: Using stores for reactive state
   ```typescript
   private todoStore = useStore<Todo[]>('todos', []);
   private inputStore = useStore<string>('newTodo', '');
   ```

3. **UI Library**: Using pre-built UI components
   ```typescript
   import { Card, Input, Button } from '@fluxion/ui';
   ```

4. **Event Handling**: Handling user interactions
   ```typescript
   private addTodo = () => {
     const text = this.inputStore.value;
     if (text.trim()) {
       this.todoStore.set(todos => [...todos, { /* ... */ }]);
     }
   };
   ```

5. **Persistence**: Automatic state persistence to localStorage
   ```typescript
   const app = new Fluxion({
     state: {
       persistence: true
     }
   });
   ```

## Features

- Add new todos
- Mark todos as complete
- Delete todos
- Persistent storage
- Responsive design

## Learning Points

- How to create components in Fluxion
- How to manage state with stores
- How to handle user interactions
- How to style components
- How to use the UI library

## Customization

You can customize the app by:

1. Modifying the theme in `index.ts`:
   ```typescript
   ThemeProvider.getInstance().setTheme({
     colorScheme: 'light',
     primaryColor: '#4CAF50',
     secondaryColor: '#F44336'
   });
   ```

2. Adding new features like:
   - Filtering todos
   - Todo categories
   - Due dates
   - Priority levels

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## Building for Production

```bash
# Create production build
npm run build
```

## Additional Resources

- [Fluxion Documentation](../../docs)
- [UI Components](../../docs/api-reference/ui.md)
- [State Management](../../docs/api-reference/state.md)