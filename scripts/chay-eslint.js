import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import process from 'node:process'

const duongDanThuMucGoc = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const duongDanNodeModules = path.join(duongDanThuMucGoc, 'node_modules')

const ketQua = spawnSync(
  process.execPath,
  [path.join(duongDanNodeModules, 'eslint', 'bin', 'eslint.js'), '.'],
  {
    cwd: duongDanThuMucGoc,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_PATH: duongDanNodeModules,
    },
  },
)

process.exit(ketQua.status ?? 1)
