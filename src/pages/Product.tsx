import { useParams } from 'react-router-dom'
import { ProductView } from '../components/ProductView'
import { LoadingRegion, Skeleton } from '../components/Skeleton'
import { useCatalog } from '../hooks/useCatalog'
import { useLanguage } from '../hooks/useLanguage'
import { useProgress } from '../hooks/useProgress'
import NotFound from './NotFound'

export default function Product() {
  const { slug } = useParams()
  const { progress } = useProgress()
  const { products, getProduct, loading, error, reload } = useCatalog()
  const { t } = useLanguage()
  const product = getProduct(slug)

  if (!product && loading) {
    return (
      <div className="container-page py-8">
        <LoadingRegion label={t('common.loading')}>
          <Skeleton className="h-10 w-40" />
          <div className="mt-6 grid gap-8 lg:grid-cols-2">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="space-y-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </LoadingRegion>
      </div>
    )
  }
  if (!product && error) {
    return (
      <div className="container-page py-16 text-center">
        <h1 className="text-3xl">{t('home.loadError')}</h1>
        <p className="mt-2 text-graphite">{t('home.loadErrorText')}</p>
        <button type="button" className="btn-primary mt-6" onClick={reload}>{t('common.retry')}</button>
      </div>
    )
  }
  if (!product) return <NotFound messageKey="product.notFound" />

  const index = products.findIndex((p) => p.id === product.id)
  return <ProductView product={product} prev={products[index - 1]} next={products[index + 1]} record={progress[product.id]} />
}
