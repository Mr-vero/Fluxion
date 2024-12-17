import express from 'express';
import { WebSocketServer } from 'ws';
import { watch } from 'chokidar';
import { build } from 'esbuild';
import path from 'path';
import { FluxionCompiler } from '@fluxion/compiler';

interface DevServerOptions {
  port: number;
  host: string;
}

export async function startDevServer(options: DevServerOptions) {
  const app = express();
  const compiler = new FluxionCompiler({
    platform: 'web',
    mode: 'development'
  });

  // Set up WebSocket server for HMR
  const wss = new WebSocketServer({ noServer: true });
  
  // Handle WebSocket connections
  wss.on('connection', (ws) => {
    console.log('Client connected to HMR WebSocket');
    
    ws.on('error', console.error);
    
    ws.on('close', () => {
      console.log('Client disconnected from HMR WebSocket');
    });
  });

  // Set up file watcher
  const watcher = watch(['src/**/*'], {
    ignored: /(^|[\/\\])\../,
    persistent: true
  });

  // Handle file changes
  watcher.on('change', async (filePath) => {
    console.log(`File changed: ${filePath}`);
    
    try {
      // Compile changed file
      const source = await readFile(filePath, 'utf-8');
      const result = await compiler.compile(source);
      
      // Build with esbuild
      await build({
        entryPoints: [filePath],
        bundle: true,
        outfile: path.join('dist', path.basename(filePath)),
        sourcemap: true,
        platform: 'browser',
        format: 'esm',
        plugins: [
          {
            name: 'fluxion',
            setup(build) {
              build.onLoad({ filter: /\.(tsx?|jsx?)$/ }, async (args) => {
                return {
                  contents: result.code,
                  loader: 'tsx'
                };
              });
            }
          }
        ]
      });

      // Notify clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'update',
            path: filePath
          }));
        }
      });
    } catch (error) {
      console.error('Compilation failed:', error);
    }
  });

  // Serve static files
  app.use(express.static('public'));
  app.use('/dist', express.static('dist'));

  // Serve HMR client script
  app.get('/__fluxion_hmr', (req, res) => {
    res.sendFile(path.join(__dirname, 'hmr-client.js'));
  });

  // Start server
  const server = app.listen(options.port, options.host, () => {
    console.log(`Dev server running at http://${options.host}:${options.port}`);
  });

  // Attach WebSocket server
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  return server;
} 