import { getJson } from './http'
import type { ModelsResponse } from './types'

export function getModels(): Promise<ModelsResponse> {
  return getJson<ModelsResponse>('/api/v1/models')
}