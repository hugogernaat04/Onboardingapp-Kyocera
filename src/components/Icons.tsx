import type { SVGProps } from 'react'

const base = (props: SVGProps<SVGSVGElement>) => ({
  'aria-hidden': true,
  viewBox: '0 0 20 20',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
})

export const CheckIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m4 10.5 4 4 8-9" /></svg>
)
export const CrossIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="m5 5 10 10M15 5 5 15" /></svg>
)
export const ArrowLeftIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M16 10H4m5-5-5 5 5 5" /></svg>
)
export const ArrowRightIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M4 10h12m-5-5 5 5-5 5" /></svg>
)
export const ChevronLeftIcon = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}><path d="M12 4 6 10l6 6" /></svg>
)
