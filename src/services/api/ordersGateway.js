import { STORAGE_KEYS } from '../../constants/storageKeys'
import { shouldUseBackend } from '../apiClient'
import { createOrderApi, getMyOrdersApi, getOrdersApi, updateOrderStatusApi } from './orderApi'
import { getStorageJSON, setStorageJSON } from '../storageService'

const readLocalOrders = () => {
  const rawOrders = getStorageJSON(STORAGE_KEYS.ORDERS, [])
  return Array.isArray(rawOrders) ? rawOrders : []
}

const saveLocalOrders = (orders) => {
  setStorageJSON(STORAGE_KEYS.ORDERS, orders)
  return orders
}

export const getOrders = async () => {
  if (shouldUseBackend()) {
    return getOrdersApi()
  }

  return readLocalOrders()
}

export const getMyOrders = async () => {
  if (shouldUseBackend()) {
    return getMyOrdersApi()
  }

  return readLocalOrders()
}

export const createOrder = async (payload) => {
  if (shouldUseBackend()) {
    return createOrderApi(payload)
  }

  const existingOrders = readLocalOrders()
  const newOrder = {
    id: Date.now(),
    ...payload,
    orderDate: payload.orderDate || new Date().toISOString(),
    status: payload.status || 'Mới Đặt',
  }

  saveLocalOrders([newOrder, ...existingOrders])
  return newOrder
}

export const updateOrderStatus = async (id, status) => {
  if (shouldUseBackend()) {
    return updateOrderStatusApi(id, status)
  }

  const orders = readLocalOrders()
  const nextOrders = orders.map((order) => (
    String(order.id) === String(id)
      ? { ...order, status }
      : order
  ))

  saveLocalOrders(nextOrders)
  return nextOrders.find((order) => String(order.id) === String(id)) || null
}
