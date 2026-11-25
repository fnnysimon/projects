import { useCallback, useEffect, useMemo } from 'react'
import { modelNeedsOwnKey } from '@/lib/billing/client/own-key'
import { useDeploymentShape } from '@/lib/core/config/deployment-shape'
import { useOptionalWorkspaceHostContext } from '@/app/workspace/[workspaceId]/providers/workspace-host-provider'
import { useBYOKKeys } from '@/hooks/queries/byok-keys'
import { useModelKeyAccessStore } from '@/stores/model-key-access/store'

/**
 * Publishes the workspace's hosted-key access (plan gate and BYOK providers) to
 * {@link useModelKeyAccessStore}, and returns whether a model can only run with the workspace's
 * own key. Paid plans, self-hosted deployments, and models Sim does not host are never flagged.
 * While the BYOK list loads, nothing is flagged: a missing badge is safer than a wrong one.
 */
export function useModelNeedsOwnKey(): (model: string) => boolean {
  const { hosted, billingEnabled } = useDeploymentShape()
  const hostContext = useOptionalWorkspaceHostContext()
  const isGated = Boolean(
    hosted && billingEnabled && hostContext && !hostContext.ownerBilling.isPaid
  )
  const { data, isSuccess } = useBYOKKeys(isGated && hostContext ? hostContext.workspace.id : '')

  const keyedProviders = useMemo(
    () => (data?.keys ?? []).map((key) => key.providerId as string),
    [data]
  )
  const isKnownGated = isGated && isSuccess

  useEffect(() => {
    useModelKeyAccessStore.getState().setAccess({ isGated: isKnownGated, keyedProviders })
  }, [isKnownGated, keyedProviders])

  return useCallback(
    (model: string) => modelNeedsOwnKey(model, { isGated: isKnownGated, keyedProviders }),
    [isKnownGated, keyedProviders]
  )
}
