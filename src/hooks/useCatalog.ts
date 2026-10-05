import { useMemo } from 'react'
import { localizeProduct, products } from '../data/products'
import { useLanguage } from './useLanguage'

/** De productlijst in de gekozen taal, plus een opzoekfunctie en de categorieën voor het filter. */
export function useCatalog() {
  const { taal } = useLanguage()
  return useMemo(() => {
    const list = products.map((p) => localizeProduct(p, taal))
    const categories = Array.from(new Map(list.map((p) => [p.categorieId, p.categorie])).entries()).map(
      ([id, label]) => ({ id, label }),
    )
    return { products: list, categories, getProduct: (id: string | undefined) => list.find((p) => p.id === id) }
  }, [taal])
}
