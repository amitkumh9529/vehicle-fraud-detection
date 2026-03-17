import { useState, useEffect, useCallback } from 'react'
import { getModelInfo, retrainModel } from '../api'

export function useModelMetrics() {
  const [info, setInfo]           = useState(null)
  const [loading, setLoading]     = useState(true)
  const [retraining, setRetraining] = useState(false)
  const [error, setError]         = useState(null)

  const fetchInfo = useCallback(async () => {
    try {
      const data = await getModelInfo()
      setInfo(data)
      setError(null)
    } catch (e) {
      setError('Could not load model info. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchInfo() }, [fetchInfo])

  const retrain = useCallback(async () => {
    setRetraining(true)
    setError(null)
    try {
      await retrainModel()
      await fetchInfo()
    } catch (e) {
      setError(e.message)
    } finally {
      setRetraining(false)
    }
  }, [fetchInfo])

  return { info, loading, retraining, error, retrain }
}
