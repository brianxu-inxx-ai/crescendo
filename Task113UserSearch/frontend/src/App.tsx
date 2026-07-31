import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<number | null>(null)

  async function load(query: string, signal?: AbortSignal): Promise<string[]> {
    const url = new URL("http://localhost:8000/api/v1/search/")
    url.searchParams.set("query", query)

    const res = await fetch(url.toString(), { signal })
    if (!res.ok) throw new Error(await res.text())
    const body = await res.json()
    // backend should return something like { items: string[] }
    return body.items ?? []
  }

  useEffect(() => {
    if (query.length > 0 && !query.trim()) {
      setResults([])
      setError(null)
      return
    }

    const ac = new AbortController()
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = window.setTimeout(() => {
      setLoading(true)
      setError(null)
      load(query, ac.signal)
        .then(setResults)
        .catch((e) => {
          if (e.name !== "AbortError") setError(e.message ?? "Fetch error")
        })
        .finally(() => setLoading(false))
    }, 250) // 250ms debounce

    return () => {
      clearTimeout(debounceRef.current ?? 0)
      ac.abort()
    }
  }, [query])

  return (
    <>
      <div style={{ padding: 40 }}>
        <h1>USER DATABASE SEARCH</h1>
        <p className="caption">Type a name to search for users in the database. Leave blank to return all users.</p>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" />
        {loading ? <div>Loading…</div> :
          <div>
            <h2 style={{ textAlign: "left" }}>Results ({results.length})</h2>
            {results.map((r) =>
            <div style={{ textAlign: "left" }} key={r}>
              {r}
            </div>)}
          </div>
        }
        {error && <div role="alert">{error}</div>}
      </div>
    </>
  )
}

export default App
