import { usePanelEditorStore } from '@/stores/panel/editor/store'

/** How long to wait for the editor to mount the field: about 30 frames at 60 Hz. */
const FIELD_LOOKUP_ATTEMPTS = 30
/** Long enough to be seen at the edge of vision, short enough not to delay typing. */
const HIGHLIGHT_DURATION_MS = 600

function findFieldInput(subBlockId: string): HTMLInputElement | HTMLTextAreaElement | null {
  const field = document.querySelector<HTMLElement>(
    `[data-workflow-search-subblock-id="${subBlockId}"]`
  )
  return field?.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea') ?? null
}

function highlightField(input: HTMLElement): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  input.animate(
    [{ boxShadow: '0 0 0 2px var(--text-error)' }, { boxShadow: '0 0 0 2px transparent' }],
    { duration: HIGHLIGHT_DURATION_MS, easing: 'ease-out' }
  )
}

/**
 * Opens a block in the editor panel and puts the cursor in one of its fields, so a fix the user
 * is told about ("add your API key") is one click away. The field renders a few frames after the
 * block opens, so this polls once per frame and gives up quietly if it never appears.
 *
 * @returns false when the field never appeared, so the caller can fall back.
 */
export function focusBlockField(blockId: string, subBlockId: string): Promise<boolean> {
  usePanelEditorStore.getState().setCurrentBlockId(blockId)
  return new Promise((resolve) => {
    let attempts = 0
    const tryFocus = () => {
      const input = findFieldInput(subBlockId)
      if (input) {
        input.scrollIntoView({ block: 'center' })
        input.focus()
        highlightField(input)
        resolve(true)
        return
      }
      attempts += 1
      if (attempts >= FIELD_LOOKUP_ATTEMPTS) {
        resolve(false)
        return
      }
      requestAnimationFrame(tryFocus)
    }
    requestAnimationFrame(tryFocus)
  })
}
