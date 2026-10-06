import { useContext, useMemo } from 'react'
import { CatalogContext } from '../context/CatalogContext'
import { localizeProduct } from '../lib/catalog'
import { useLanguage } from './useLanguage'

/** De gepubliceerde producten in de gekozen taal, plus een opzoekfunctie (op slug), de categorieën voor het filter en de laadstatus. */
export function useCatalog() {
  const { taal } = useLanguage()
  const { products: source, loading, error, reload } = useContext(CatalogContext)
  return useMemo(() => {
    const list = source.map((p) => localizeProduct(p, taal))
    const categories = Array.from(new Map(list.map((p) => [p.categorieId, p.categorie])).entries()).map(
      ([id, label]) => ({ id, label }),
    )
    return {
      products: list,
      categories,
      getProduct: (slug: string | undefined) => list.find((p) => p.slug === slug),
      loading,
      error,
      reload,
    }
  }, [source, taal, loading, error, reload])
}
