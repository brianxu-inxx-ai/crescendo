import type { ModelInfo } from '../api/types'

interface ModelListProps {
  models: ModelInfo[]
}

export function ModelList({ models }: ModelListProps) {
  if (models.length === 0) {
    return <p className="status-message">No models are currently available.</p>
  }

  return (
    <ul className="model-list">
      {models.map((model) => (
        <li className="model-item" key={model.id}>
          <strong>{model.id}</strong>
          <span>{model.huggingface_id}</span>
        </li>
      ))}
    </ul>
  )
}