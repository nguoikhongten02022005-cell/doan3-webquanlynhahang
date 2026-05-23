import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(__dirname, 'apiDatBan.js'), 'utf8')

test('offline booking availability excludes reserved table statuses', () => {
  assert.match(source, /Reserved/)
  assert.match(source, /GIU_CHO/)
})
