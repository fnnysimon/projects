/**
 * Wording of the error a free-plan run gets when it asks for Sim's hosted key. Kept free of
 * server imports so the browser can recognize the message in a run's log and offer the fix.
 */
const HOSTED_KEY_PAID_PLAN_SUFFIX =
  " needs your own API key on the Free plan. Add one in Settings > BYOK (Bring your own key), or upgrade to use Sim's key."

/** @param subject - what asked for the key: a tool's name or a model id */
export function buildHostedKeyPaidPlanMessage(subject: string): string {
  return `${subject}${HOSTED_KEY_PAID_PLAN_SUFFIX}`
}

/** Whether a run error is the free-plan hosted-key refusal, so the UI can link to the fix. */
export function isHostedKeyPaidPlanMessage(message: string): boolean {
  return message.includes(HOSTED_KEY_PAID_PLAN_SUFFIX)
}
