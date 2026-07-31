import { postJson } from './http'
import type {
  SubmitAttackRequest,
  SubmitAttackResponse,
} from './types'

export function submitAttack(
  payload: SubmitAttackRequest,
): Promise<SubmitAttackResponse> {
  return postJson<SubmitAttackResponse>('/api/v1/attacks', payload)
}