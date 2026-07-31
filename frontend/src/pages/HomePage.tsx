import { useEffect, useState } from 'react'
import { getModels } from '../api/models'
import type { ModelInfo } from '../api/types'
import { ModelList } from '../components/ModelList'

export function HomePage() {
  const [models, setModels] = useState<ModelInfo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadModels() {
      try {
        const result = await getModels()
        if (!ignore) setModels(result.models)
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Unknown error'
        if (!ignore) setError(message)
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    loadModels()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Crescendo Frontend</p>
        <h1>AI Safety Evaluation Dashboard</h1>
        <p className="lead">
          Selectable evaluation models are loaded from the backend API.
        </p>

        <div className="models-section">
          <h2>Available Models</h2>
          {isLoading && <p className="status-message">Loading models...</p>}
          {error && <p className="error-message">Failed to load models: {error}</p>}
          {!isLoading && !error && <ModelList models={models} />}
        </div>
      </section>
    </main>
  )
}