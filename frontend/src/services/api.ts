import type { CreateOrderRequest, Order, Product } from '../types'

const BASE_URL = 'http://localhost:8080/api'

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products`)

  if (!response.ok) {
    throw new Error('Failed to fetch products')
  }

  return (await response.json()) as Product[]
}

export async function fetchProduct(id: number): Promise<Product> {
  // TODO: Use Copilot to implement GET /api/products/{id}
  // Hint: call fetch(`${BASE_URL}/products/${id}`), check response.ok, and return response.json()
  throw new Error(`TODO: implement fetchProduct for product ${id}`)
}

export async function createOrder(request: CreateOrderRequest): Promise<Order> {
  // TODO: Use Copilot to implement POST /api/orders
  // Hint: POST to `${BASE_URL}/orders` with JSON body and Content-Type: application/json
  throw new Error(`TODO: implement createOrder for ${request.customerEmail}`)
}

export async function fetchOrder(id: number): Promise<Order> {
  /** 
  TODO: Use Copilot to implement GET /api/orders/{id}
  Hint: call fetch(`${BASE_URL}/orders/${id}`), check response.ok, and return response.json()
  */
  throw new Error(`TODO: implement fetchOrder for order ${id}`)
}
