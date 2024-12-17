import { Fluxion } from '@fluxion/core';
import { ThemeProvider } from '@fluxion/ui';
import { TodoApp } from './components/TodoApp';
import './styles.css';

// Initialize Fluxion
const app = new Fluxion({
  mode: 'development',
  platform: 'web',
  state: {
    persistence: true // Enable localStorage persistence
  }
});

// Configure theme
ThemeProvider.getInstance().setTheme({
  colorScheme: 'light',
  primaryColor: '#4CAF50',
  secondaryColor: '#F44336'
});

// Mount the app
app.mount(TodoApp, document.getElementById('root')); 