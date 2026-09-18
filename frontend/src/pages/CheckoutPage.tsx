import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { createOrder } from '../services/api'
import type { CartItem, CreateOrderRequest } from '../types'

const CART_STORAGE_KEY = 'webshop-cart'

function readCartItems(): CartItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY)
    return storedValue ? (JSON.parse(storedValue) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CheckoutPage() {
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const cartItems = useMemo(() => readCartItems(), [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatusMessage(null)
    setErrorMessage(null)

    const draftRequest: CreateOrderRequest = {
      customerName,
      customerEmail,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    }

    try {
      const order = await createOrder(draftRequest)
      window.localStorage.removeItem(CART_STORAGE_KEY)
      setStatusMessage(`Order placed successfully. Your order ID is ${order.id}.`)
    } catch (error: unknown) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to place your order.')
    }
  }

  return (
    <section style={{ maxWidth: '640px', margin: '0 auto', backgroundColor: '#fff', padding: '24px', borderRadius: '16px' }}>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
        <label>
          <span style={{ display: 'block', marginBottom: '6px' }}>Customer name</span>
          <input value={customerName} onChange={(event) => setCustomerName(event.target.value)} required style={{ width: '100%', padding: '10px' }} />
        </label>

        <label>
          <span style={{ display: 'block', marginBottom: '6px' }}>Customer email</span>
          <input
            type="email"
            value={customerEmail}
            onChange={(event) => setCustomerEmail(event.target.value)}
            required
            style={{ width: '100%', padding: '10px' }}
          />
        </label>

        <div>
          <h2 style={{ marginBottom: '8px' }}>Cart summary</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is currently empty.</p>
          ) : (
            <ul>
              {cartItems.map((item) => (
                <li key={item.product.id}>
                  {item.product.name} × {item.quantity}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit">Place order</button>
      </form>
      {statusMessage && <p style={{ marginTop: '16px', color: '#2563eb' }}>{statusMessage}</p>}
      {errorMessage && <p style={{ marginTop: '16px', color: '#dc2626' }}>{errorMessage}</p>}
    </section>
  )
}
