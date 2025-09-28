import { useState, useEffect } from 'react'
import { EdgeFunctionService } from '../services/edgeFunctions'
import { supabase } from '../lib/supabase'

export function EdgeFunctionExample() {
  const [mantras, _setMantras] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  const testGetMantras = async () => {
    setLoading(true)
    setError(null)
    try {
      await EdgeFunctionService.getMantras()
      // setMantras(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
    setLoading(false)
  }

  const testGetMantrasByEmotion = async () => {
    setLoading(true)
    setError(null)
    try {
      await EdgeFunctionService.getMantras('ANXIETY')
      // setMantras(result.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
    setLoading(false)
  }

  const testGetMantraById = async () => {
    setLoading(true)
    setError(null)
    try {
      await EdgeFunctionService.getMantraById(1)
      // if (result.data) {
      //   setMantras([result.data])
      // }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
    setLoading(false)
  }

  const testCreateSession = async () => {
    if (!user) {
      setError('Please sign in first')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await EdgeFunctionService.createSession({
        mantra_id: 1,
        repetitions: 108,
        duration_seconds: 1800,
        notes: 'Test session from browser'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
    setLoading(false)
  }

  const testGetUserStats = async () => {
    if (!user) {
      setError('Please sign in first')
      return
    }

    setLoading(true)
    setError(null)
    try {
      await EdgeFunctionService.getUserStats(user.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">🧪 Edge Functions Test</h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          User: {user ? `${user.email} (${user.id})` : 'Not signed in'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={testGetMantras}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test GET /mantras'}
        </button>

        <button
          onClick={testGetMantrasByEmotion}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test GET /mantras?emotion=ANXIETY'}
        </button>

        <button
          onClick={testGetMantraById}
          disabled={loading}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test GET /mantras/1'}
        </button>

        <button
          onClick={testCreateSession}
          disabled={loading || !user}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test POST /sessions'}
        </button>

        <button
          onClick={testGetUserStats}
          disabled={loading || !user}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Test GET /users/:id/stats'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {mantras.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">📋 Results:</h3>
          <div className="space-y-2">
            {mantras.map((mantra: any) => (
              <div key={mantra.id} className="p-3 bg-gray-50 rounded border">
                <p><strong>ID:</strong> {mantra.id}</p>
                <p><strong>Transliteration:</strong> {mantra.transliteration}</p>
                <p><strong>Meaning:</strong> {mantra.meaning}</p>
                <p><strong>Emotions:</strong> {mantra.emotions?.join(', ')}</p>
                {mantra.audio_url && (
                  <p><strong>Audio:</strong> <a href={mantra.audio_url} className="text-blue-500 hover:underline">Listen</a></p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Instructions:</strong></p>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>Make sure you're signed in to test authenticated endpoints</li>
          <li>Check the browser console for detailed logs</li>
          <li>All endpoints require authentication</li>
          <li>Your Edge Functions are deployed and ready!</li>
        </ol>
      </div>
    </div>
  )
}
