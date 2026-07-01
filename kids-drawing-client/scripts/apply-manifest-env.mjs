/**
 * 将环境变量写入 src/manifest.json（H5 路由 base 等）
 * 用法：
 *   VITE_H5_BASE=/kids-drawing/ node scripts/apply-manifest-env.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(__dirname, '../src/manifest.json');

/** H5 路由 base，生产部署为 /kids-drawing/ */
const h5Base = process.env.VITE_H5_BASE || process.env.H5_BASE || '';

let text = fs.readFileSync(manifestPath, 'utf8');

if (h5Base) {
  // 写入 h5.router.base，供 uni-app H5 子路径部署
  if (/"base"\s*:/.test(text)) {
    text = text.replace(/("base"\s*:\s*")[^"]*(")/, `$1${h5Base}$2`);
  } else {
    text = text.replace(
      /("router"\s*:\s*\{[^}]*"mode"\s*:\s*"[^"]*")/,
      `$1,\n      "base": "${h5Base}"`,
    );
  }
}

fs.writeFileSync(manifestPath, text);

console.log(`[apply-manifest-env] h5.base=${h5Base || '(unchanged)'}`);
