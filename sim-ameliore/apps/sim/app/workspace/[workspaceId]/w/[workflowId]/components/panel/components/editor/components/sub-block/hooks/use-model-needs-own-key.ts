import { useCallback, useMemo } from 'react'
import { useDeploymentShape } from '@/lib/core/config/deployment-shape'
import { useOptionalWorkspaceHostContext } from '@/app/workspace/[workspaceId]/providers/workspace-host-provider'
import { useBYOKKeys } from '@/hooks/queries/byok-keys'
import { getHostedModels } from '@/providers/models'
import { getProviderFromModel } from '@/providers/utils'

const HOSTED_MODEL_IDS = new Set(getHostedModels().map((model) => model.toLowerCase()))

function getModelProvider(model: string): string | null {
  try {
    return getProviderFromModel(model)
  } catch {
    return null
  }
}

/**
 * Whether a model can only run with the workspace's own API key. Mirrors the server rule in
 * `resolveHostedModelKey`: on hosted Sim with billing, a free-plan workspace may not use Sim's
 * key for a catalogued model, so it needs a BYOK key for that model's provider. Paid plans,
 * self-hosted deployments, and models Sim does not host are never flagged.
 */
export function useModelNeedsOwnKey(): (model: string) => boolean {
  const { hosted, billingEnabled } = useDeploymentShape()
  const hostContext = useOptionalWorkspaceHostContext()
  const isGated = Boolean(
    hosted && billingEnabled && hostContext && !hostContext.ownerBilling.isPaid
  )
  const { data } = useBYOKKeys(isGated && hostContext ? hostContext.workspace.id : '')

  const keyedProviders = useMemo(
    () => new Set<string>((data?.keys ?? []).map((key) => key.providerId)),
    [data]
  )

  return useCallback(
    (model: string) => {
      if (!isGated || !HOSTED_MODEL_IDS.has(model.toLowerCase())) return false
      const provider = getModelProvider(model)
      return provider !== null && !keyedProviders.has(provider)
    },
    [isGated, keyedProviders]
  )
}
