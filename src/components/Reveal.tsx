import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  as?: 'div' | 'li' | 'section' | 'aside'
  className?: string
  /** Vertraging in ms, handig voor een trapsgewijze opbouw in een grid */
  delay?: number
  labelledBy?: string
  id?: string
}

/**
 * Laat een element bij het scrollen inzoomen en in beeld faden.
 * Zonder IntersectionObserver of bij prefers-reduced-motion blijft alles gewoon zichtbaar.
 */
export function Reveal({ children, as: Tag = 'div', className, delay = 0, labelledBy, id }: Props) {
  const ref = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    el.dataset.reveal = 'hidden'
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.dataset.reveal = 'shown'
        observer.disconnect()
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      delete el.dataset.reveal
    }
  }, [])

  return (
    <Tag ref={ref as never} id={id} aria-labelledby={labelledBy} className={className} style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  )
}
