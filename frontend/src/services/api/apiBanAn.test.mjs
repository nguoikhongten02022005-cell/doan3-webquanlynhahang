import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(__dirname, 'apiBanAn.js'), 'utf8')

test('table API mapper keeps backend table statuses distinct', () => {
  assert.equal(source.includes("trangThai === 'CHO_THANH_TOAN' || trangThai === 'Reserved'"), false)
  assert.match(source, /Reserved/)
  assert.match(source, /Maintenance/)
})

test('table API mapper does not default unknown table status to available', () => {
  assert.equal(source.includes("return trangThai || 'TRONG'"), false)
})
