import { Link } from 'react-router-dom'
import type { Product } from '../data/products'
import { Reveal } from './Reveal'
import { CheckIcon } from './Icons'
import { ProductImage } from './ProductImage'

export function ProductCard({ product, passed, delay = 0 }: { product: Product; passed: boolean; delay?: number }) {
  return (
    <Reveal as="li" delay={delay}>
      <Link
        to={`/product/${product.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-mist bg-white shadow-card transition-transform duration-200 hover:-translate-y-0.5 hover:border-ink"
      >
        <div className="relative overflow-hidden">
          <ProductImage
            product={product}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-300 group-hover:scale-[1.03]"
          />
          {passed && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1.5 text-sm font-semibold text-white shadow animate-pop">
              <CheckIcon className="h-4 w-4" />
              Quiz gehaald
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="text-sm font-semibold text-kyocera-red-dark">{product.categorie}</p>
          <h3 className="text-2xl leading-tight">{product.naam}</h3>
          <p className="text-graphite">{product.korteOmschrijving}</p>
        </div>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-kyocera-red transition-transform duration-300 group-hover:scale-x-100" />
      </Link>
    </Reveal>
  )
}
