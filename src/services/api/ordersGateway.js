import { createOrderApi, getMyOrdersApi, getOrdersApi, updateOrderStatusApi } from './orderApi'

export const getOrders = async () => getOrdersApi()

export const getMyOrders = async () => getMyOrdersApi()

export const createOrder = async (payload) => createOrderApi(payload)

export const updateOrderStatus = async (id, status) => updateOrderStatusApi(id, status)
