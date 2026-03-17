const BASE_URL = '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` }))
    throw new Error(err.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const predictFraud   = (data)  => request('/predict', { method: 'POST', body: JSON.stringify(data) })
export const getModelInfo   = ()      => request('/model/info')
export const retrainModel   = ()      => request('/train', { method: 'POST' })
export const healthCheck    = ()      => request('/health')
