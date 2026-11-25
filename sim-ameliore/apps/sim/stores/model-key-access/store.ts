import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { registerUserDataReset } from '@/stores/user-data-reset-registry'

/**
 * Whether the open workspace may run Sim-hosted models on Sim's key, mirrored from React data
 * (deployment shape, workspace plan, BYOK key list) so non-React readers such as sub-block
 * visibility conditions can ask whether a model needs the workspace's own key. Empty on the
 * server, where every reader falls back to today's behavior.
 */
interface ModelKeyAccessState {
  /** Hosted Sim with billing, and the workspace is on the Free plan. */
  isGated: boolean
  /** Providers the workspace has a BYOK key for. */
  keyedProviders: readonly string[]
  setAccess: (access: { isGated: boolean; keyedProviders: readonly string[] }) => void
  reset: () => void
}

const initialState = { isGated: false, keyedProviders: [] as readonly string[] }

function sameProviders(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((provider, index) => provider === b[index])
}

export const useModelKeyAccessStore = create<ModelKeyAccessState>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setAccess: ({ isGated, keyedProviders }) => {
        const current = get()
        if (current.isGated === isGated && sameProviders(current.keyedProviders, keyedProviders)) {
          return
        }
        set({ isGated, keyedProviders })
      },
      reset: () => set(initialState),
    }),
    { name: 'model-key-access-store' }
  )
)

registerUserDataReset('model-key-access', () => useModelKeyAccessStore.getState().reset())
