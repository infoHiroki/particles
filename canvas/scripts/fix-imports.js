/**
 * ビルド後のJSファイルのインポートパスに.js拡張子を追加
 * ブラウザのESモジュールは拡張子必須のため
 */
import { readdir, readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const distDir = new URL('../dist', import.meta.url).pathname;

async function fixImports(dir) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      await fixImports(fullPath);
    } else if (entry.name.endsWith('.js')) {
      let content = await readFile(fullPath, 'utf-8');

      // from './xxx' → from './xxx.js'
      // from '../xxx' → from '../xxx.js'
      const fixed = content.replace(
        /from\s+['"](\.[^'"]+)(?<!\.js)['"]/g,
        (match, path) => {
          if (path.endsWith('.js')) return match;
          return `from '${path}.js'`;
        }
      );

      if (fixed !== content) {
        await writeFile(fullPath, fixed);
        console.log(`Fixed: ${fullPath}`);
      }
    }
  }
}

fixImports(distDir).catch(console.error);
