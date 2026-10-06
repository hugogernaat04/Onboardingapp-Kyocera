import { Link } from 'react-router-dom'
import type { LocalizedProduct } from '../lib/catalog'
import { useLanguage } from '../hooks/useLanguage'
import { Reveal } from './Reveal'
import { CheckIcon } from './Icons'
import { ProductImage } from './ProductImage'

export function ProductCard({ product, passed, delay = 0 }: { product: LocalizedProduct; passed: boolean; delay?: number }) {
  const { t } = useLanguage()
  return (
    <Reveal as="li" delay={delay}>
      <Link
        to={`/product/${product.slug}`}
        className="group flex h-full flex-col rounded-[1.75rem] bg-fog p-1.5 ring-1 ring-ink/10 transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-card hover:ring-ink/30"
      >
        <div className="relative flex flex-1 flex-col overflow-hidden rounded-[calc(1.75rem-0.375rem)] bg-white shadow-[inset_0_1px_0_rgb(255_255_255)]">
        <div className="relative overflow-hidden">
          <ProductImage
            product={product}
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="transition-transform duration-700 group-hover:scale-[1.04]"
          />
          {passed && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-success px-3 py-1.5 text-sm font-semibold text-white shadow animate-pop">
              <CheckIcon className="h-4 w-4" />
              {t('card.passed')}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <p className="text-sm font-semibold text-kyocera-red-dark">{product.categorie}</p>
          <h3 className="text-2xl leading-tight">{product.naam}</h3>
          <p className="text-graphite">{product.korteOmschrijving}</p>
        </div>
        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-kyocera-red transition-transform duration-500 group-hover:scale-x-100" />
        </div>
      </Link>
    </Reveal>
  )
}
