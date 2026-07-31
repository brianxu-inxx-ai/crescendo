export interface ModelInfo {
  id: string
  huggingface_id: string
}

export interface ModelsResponse {
  models: ModelInfo[]
}

export type StrategyName = 'template' | 'reactive' | 'gemini'

export interface SubmitAttackRequest {
  objective: string
  models: string[]
  strategy: StrategyName
  temperature: number
  max_turns: number
  seed: number | null
}

export interface SubmitAttackResponse {
  job_id: string
  status: 'queued'
  objective: string
  strategy: StrategyName
  models: string[]
  max_turns: number
}