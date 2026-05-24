import assert from 'node:assert/strict'
import { isActivationKey } from '../components/BanAnTab.jsx'

assert.equal(isActivationKey('Enter'), true)
assert.equal(isActivationKey(' '), true)
assert.equal(isActivationKey('Spacebar'), false)
