import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Cart } from '../components/Cart'
import { ProductCard } from '../components/ProductCard'
import { fetchProducts } from '../services/api'
import type { CartItem, Product } from '../types'

const CART_STORAGE_KEY = 'webshop-cart'

function readCartItems(): CartItem[] {
  try {
    const storedValue = window.localStorage.getItem(CART_STORAGE_KEY)
    return storedValue ? (JSON.parse(storedValue) as CartItem[]) : []
  } catch {
    return []
  }
}

function saveCartItems(items: CartItem[]): void {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
  window.dispatchEvent(new Event('cart-updated'))
}

export function ProductsPage() {
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>(() => readCartItems())
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true)

      try {
        const fetchedProducts = await fetchProducts()
        setProducts(fetchedProducts)
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : 'Failed to fetch products')
      } finally {
        setLoading(false)
      }
    }

    void loadProducts()
  }, [])

  const handleAddToCart = (product: Product) => {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id)

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return currentItems
        }

        const updatedItems = currentItems.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
        saveCartItems(updatedItems)
        return updatedItems
      }

      if (product.stock === 0) {
        return currentItems
      }

      const updatedItems = [...currentItems, { product, quantity: 1 }]
      saveCartItems(updatedItems)
      return updatedItems
    })
  }

  const handleRemoveItem = (productId: number) => {
    setCartItems((currentItems) => {
      const updatedItems = currentItems.filter((item) => item.product.id !== productId)
      saveCartItems(updatedItems)
      return updatedItems
    })
  }

  const handleCheckout = () => {
    navigate('/checkout')
  }

  return (
    <div style={{ display: 'grid', gap: '24px', gridTemplateColumns: '2fr 1fr' }}>
      <section>
        <h1>Products</h1>
        <p style={{ color: '#475569', marginBottom: '24px' }}>
          TODO: Use Copilot to complete this page so it fetches products, manages cart state, and renders the catalog.
        </p>
        {/* TODO: Use Copilot to:
            1. Fetch products using fetchProducts() from '../services/api'
            2. Manage cart state with useState
            3. Implement addToCart function (add or increment quantity)
            4. Render a grid of <ProductCard> components
            5. Render <Cart> sidebar
        */}
        {loading && <p>Loading products...</p>}
        {error && <p style={{ color: '#dc2626' }}>{error}</p>}
        {products.length === 0 ? (
          <div style={{ border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '24px', backgroundColor: '#fff' }}>
            <p style={{ margin: 0 }}>No products loaded yet. Ask Copilot to implement the fetch flow.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </section>

      <Cart items={cartItems} onRemoveItem={handleRemoveItem} onCheckout={handleCheckout} />
    </div>
  )
}
