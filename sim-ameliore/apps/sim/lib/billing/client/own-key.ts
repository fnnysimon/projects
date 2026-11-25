import { getHostedModels } from '@/providers/models'
import { getProviderFromModel } from '@/providers/utils'

interface ModelKeyAccess {
  isGated: boolean
  keyedProviders: readonly string[]
}

let hostedModelIds: Set<string> | null = null

/** Whether Sim serves this model on its own key (the catalogued hosted models). */
export function isHostedModel(model: string): boolean {
  hostedModelIds ??= new Set(getHostedModels().map((id) => id.toLowerCase()))
  return hostedModelIds.has(model.trim().toLowerCase())
}

function getModelProvider(model: string): string | null {
  try {
    return getProviderFromModel(model)
  } catch {
    return null
  }
}

/**
 * Whether a model can only run with the workspace's own API key. Mirrors the server rule in
 * `resolveHostedModelKey`: a gated (free-plan, hosted) workspace may not use Sim's key for a
 * hosted model, so it needs a BYOK key for that model's provider, or a key on the block.
 */
export function modelNeedsOwnKey(model: string, access: ModelKeyAccess): boolean {
  if (!access.isGated || !isHostedModel(model)) return false
  const provider = getModelProvider(model)
  return provider !== null && !access.keyedProviders.includes(provider)
}
