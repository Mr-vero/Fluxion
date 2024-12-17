import { build as esbuild } from 'esbuild';
import path from 'path';
import fs from 'fs/promises';
import { FluxionCompiler } from '@fluxion/compiler';

interface BuildOptions {
  out: string;
  analyze?: boolean;
}

export async function build(options: BuildOptions) {
  const compiler = new FluxionCompiler({
    platform: 'web',
    mode: 'production',
    optimize: true
  });

  // Ensure output directory exists
  await fs.mkdir(options.out, { recursive: true });

  // Build the application
  const result = await esbuild({
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    splitting: true,
    format: 'esm',
    outdir: options.out,
    metafile: options.analyze,
    plugins: [
      {
        name: 'fluxion',
        setup(build) {
          // Handle Fluxion components
          build.onLoad({ filter: /\.(tsx?|jsx?)$/ }, async (args) => {
            const source = await fs.readFile(args.path, 'utf8');
            const result = await compiler.compile(source);
            
            return {
              contents: result.code,
              loader: 'tsx'
            };
          });
        }
      }
    ]
  });

  if (options.analyze && result.metafile) {
    // Generate bundle analysis
    console.log('\nBundle analysis:');
    for (const [file, info] of Object.entries(result.metafile.outputs)) {
      console.log(`\n${file}:`);
      console.log(`  Size: ${(info.bytes / 1024).toFixed(2)}kb`);
      console.log('  Imports:');
      info.imports.forEach((imp) => {
        console.log(`    - ${imp.path}`);
      });
    }
  }

  console.log('\nBuild completed successfully!');
} 