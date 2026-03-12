import { createOrderApi, getMyOrdersApi, getOrdersApi, updateOrderStatusApi } from './orderApi'

export const getOrders = async () => {
  const { duLieu } = await getOrdersApi()
  return Array.isArray(duLieu) ? duLieu : []
}

export const getMyOrders = async () => {
  const { duLieu } = await getMyOrdersApi()
  return Array.isArray(duLieu) ? duLieu : []
}

export const createOrder = async (payload) => {
  const { duLieu } = await createOrderApi(payload)
  return duLieu
}

export const updateOrderStatus = async (id, status) => {
  const { duLieu } = await updateOrderStatusApi(id, status)
  return duLieu
}
