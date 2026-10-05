import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from './Icons'

const inner = (children: ReactNode) => (
  <>
    <span className="pl-3">{children}</span>
    <span className="btn-cta-icon"><ArrowRightIcon className="h-4 w-4" /></span>
  </>
)

export function CtaLink({ to, children, className = '' }: { to: string; children: ReactNode; className?: string }) {
  return <Link to={to} className={`btn-cta ${className}`}>{inner(children)}</Link>
}

export function CtaButton({ onClick, children, className = '', buttonRef }: {
  onClick: () => void
  children: ReactNode
  className?: string
  buttonRef?: React.Ref<HTMLButtonElement>
}) {
  return <button ref={buttonRef} type="button" onClick={onClick} className={`btn-cta ${className}`}>{inner(children)}</button>
}
