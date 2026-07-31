export interface ModelInfo {
  id: string
  huggingface_id: string
}

export interface ModelsResponse {
  models: ModelInfo[]
}