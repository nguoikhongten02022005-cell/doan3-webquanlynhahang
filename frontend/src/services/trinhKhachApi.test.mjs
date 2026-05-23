import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(__dirname, 'trinhKhachApi.js'), 'utf8')

test('api client does not force browser redirect when refresh fails', () => {
  assert.equal(source.includes('window.location.href'), false)
})

test('api client does not clear auth session automatically on 401', () => {
  assert.equal(source.includes('xoaPhienXacThuc()'), false)
})
