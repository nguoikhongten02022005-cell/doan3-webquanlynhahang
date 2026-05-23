import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const source = readFileSync(join(__dirname, 'dichVuXacThuc.js'), 'utf8')

test('auth service stores customer and internal sessions under separate keys', () => {
  assert.match(source, /restaurant_customer_current_user/)
  assert.match(source, /restaurant_internal_current_user/)
  assert.match(source, /restaurant_customer_auth_token/)
  assert.match(source, /restaurant_internal_auth_token/)
})

test('auth service keeps public pages on customer session and internal pages on internal session', () => {
  assert.match(source, /\/noi-bo/)
  assert.match(source, /PHAM_VI_XAC_THUC\.NOI_BO/)
  assert.match(source, /PHAM_VI_XAC_THUC\.KHACH_HANG/)
})
