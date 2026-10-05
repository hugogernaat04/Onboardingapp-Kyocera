import { useState } from 'react'
import { publicUrl } from '../lib/media'
import type { Product } from '../data/products'

interface Props {
  product: Pick<Product, 'naam' | 'categorie' | 'afbeelding'>
  priority?: boolean
  className?: string
  sizes?: string
}

/** Productafbeelding met vaste 4:3-verhouding, lazy loading en een skeleton tot hij geladen is. */
export function ProductImage({ product, priority = false, className = '', sizes }: Props) {
  const [loaded, setLoaded] = useState(false)
  return (
    <div className={`aspect-[4/3] w-full bg-fog ${loaded ? '' : 'animate-pulse'}`}>
      <img
        ref={(img) => { if (img?.complete) setLoaded(true) }}
        src={publicUrl('images', product.afbeelding)}
        alt={`${product.naam}, ${product.categorie}`}
        width={800}
        height={600}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  )
}
