import assert from 'node:assert/strict'
import { laDatBanDangHoatDong } from '../boChon.js'

assert.equal(laDatBanDangHoatDong({ status: 'pending' }), true)
assert.equal(laDatBanDangHoatDong({ status: 'PENDING' }), true)
assert.equal(laDatBanDangHoatDong({ status: 'Pending' }), true)
