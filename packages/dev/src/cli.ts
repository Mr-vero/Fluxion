import { Command } from 'commander';
import { startDevServer } from './dev-server';
import { build } from './build';

const program = new Command();

program
  .name('fluxion')
  .description('Fluxion.js development tools')
  .version('0.1.0');

program
  .command('dev')
  .description('Start development server')
  .option('-p, --port <number>', 'Port number', '3000')
  .option('-h, --host <string>', 'Host address', 'localhost')
  .action(async (options) => {
    try {
      await startDevServer(options);
    } catch (error) {
      console.error('Failed to start dev server:', error);
      process.exit(1);
    }
  });

program
  .command('build')
  .description('Build for production')
  .option('-o, --out <dir>', 'Output directory', 'dist')
  .option('--analyze', 'Analyze bundle size')
  .action(async (options) => {
    try {
      await build(options);
    } catch (error) {
      console.error('Build failed:', error);
      process.exit(1);
    }
  });

export default program; 