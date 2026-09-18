import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
}

/** Renders a product with its current stock status and add-to-cart action. */
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const isOutOfStock = product.stock === 0
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(product.price)

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <img className="h-48 w-full object-cover" src={product.imageUrl} alt={product.name} />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
              {product.category}
            </span>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">{product.name}</h3>
          </div>
          <span
            className={`shrink-0 rounded-full px-2 py-1 text-xs font-semibold ${
              isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-600">{product.description}</p>
        <p className="mt-auto text-xl font-bold text-slate-900">{formattedPrice}</p>
        <button
          className="w-full rounded-md bg-slate-900 px-4 py-2.5 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          type="button"
          disabled={isOutOfStock}
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
      </div>
    </article>
  )
}
