import { publicUrl } from '../lib/media'
import type { Product } from '../data/products'

interface Props {
  product: Pick<Product, 'naam' | 'categorie' | 'afbeelding'>
  priority?: boolean
  className?: string
  sizes?: string
}

/** Productafbeelding met vaste 4:3-verhouding (geen verspringende layout) en lazy loading. */
export function ProductImage({ product, priority = false, className = '', sizes }: Props) {
  return (
    <img
      src={publicUrl('images', product.afbeelding)}
      alt={`${product.naam}, ${product.categorie}`}
      width={800}
      height={600}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={`aspect-[4/3] w-full bg-fog object-cover ${className}`}
    />
  )
}
