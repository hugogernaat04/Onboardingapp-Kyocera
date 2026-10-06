import { useEffect, useRef, type ReactNode } from 'react'

/** Groot venster met een voorbeeld van de productpagina. De inhoud is niet bedienbaar (inert); het is alleen om te bekijken. */
export function PreviewDialog({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label="Voorbeeld van de productpagina"
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className="m-auto h-[92dvh] w-[calc(100%-1rem)] max-w-6xl overflow-hidden rounded-2xl p-0 shadow-2xl backdrop:bg-ink/60"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-mist bg-white px-4 py-2">
          <p className="font-semibold">Voorbeeld: zo ziet de productpagina eruit</p>
          <button type="button" className="btn-secondary" onClick={onClose} autoFocus>Sluiten</button>
        </div>
        {open && (
          <div className="flex-1 overflow-y-auto bg-white" tabIndex={0} role="region" aria-label="Voorbeeld, scrollbaar">
            <div {...{ inert: true }}>{children}</div>
          </div>
        )}
      </div>
    </dialog>
  )
}
