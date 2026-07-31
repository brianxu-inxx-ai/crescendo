const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const apiBaseUrl = rawBaseUrl.replace(/\/$/, '')

export async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`)

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`)
  }

  return response.json() as Promise<T>
}