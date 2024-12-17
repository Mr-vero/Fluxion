import { FluxionComponent } from '@fluxion/core';
import { Card, Input, Button } from '@fluxion/ui';
import { useStore } from '@fluxion/state';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export class TodoApp extends FluxionComponent {
  private todoStore = useStore<Todo[]>('todos', []);
  private inputStore = useStore<string>('newTodo', '');

  private addTodo = () => {
    const text = this.inputStore.value;
    if (text.trim()) {
      this.todoStore.set(todos => [
        ...todos,
        {
          id: Date.now(),
          text,
          completed: false
        }
      ]);
      this.inputStore.set('');
    }
  };

  private toggleTodo = (id: number) => {
    this.todoStore.set(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  private deleteTodo = (id: number) => {
    this.todoStore.set(todos => todos.filter(todo => todo.id !== id));
  };

  render() {
    const todos = this.todoStore.value;
    const newTodo = this.inputStore.value;

    return {
      type: Card,
      props: {
        title: 'Fluxion Todo App',
        elevated: true,
        padding: true
      },
      children: [
        {
          type: 'div',
          props: { className: 'todo-input' },
          children: [
            {
              type: Input,
              props: {
                value: newTodo,
                placeholder: 'What needs to be done?',
                onChange: (value) => this.inputStore.set(value),
                onKeyPress: (e) => e.key === 'Enter' && this.addTodo()
              }
            },
            {
              type: Button,
              props: {
                onClick: this.addTodo,
                variant: 'primary'
              },
              children: 'Add Todo'
            }
          ]
        },
        {
          type: 'ul',
          props: { className: 'todo-list' },
          children: todos.map(todo => ({
            type: 'li',
            props: {
              className: `todo-item ${todo.completed ? 'completed' : ''}`,
              key: todo.id
            },
            children: [
              {
                type: 'input',
                props: {
                  type: 'checkbox',
                  checked: todo.completed,
                  onChange: () => this.toggleTodo(todo.id)
                }
              },
              {
                type: 'span',
                props: { className: 'todo-text' },
                children: todo.text
              },
              {
                type: Button,
                props: {
                  onClick: () => this.deleteTodo(todo.id),
                  variant: 'secondary',
                  size: 'sm'
                },
                children: 'Delete'
              }
            ]
          }))
        }
      ]
    };
  }
} 