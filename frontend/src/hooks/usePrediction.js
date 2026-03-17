import { useState, useCallback } from 'react'
import { predictFraud } from '../api'
import { DEFAULT_VALUES, FORM_SECTIONS } from '../config/formConfig'

export function usePrediction() {
  const [formData, setFormData]       = useState(DEFAULT_VALUES)
  const [result, setResult]           = useState(null)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const updateField = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setFieldErrors(prev => ({ ...prev, [name]: undefined }))
  }, [])

  const loadPreset = useCallback((preset) => {
    setFormData(preset)
    setFieldErrors({})
    setError(null)
  }, [])

  const validateSection = useCallback((section) => {
    const errs = {}
    section.fields.forEach(f => {
      const val = formData[f.name]
      if (val === '' || val === undefined || val === null) {
        errs[f.name] = 'Required'
      } else if (f.type === 'number') {
        const n = Number(val)
        if (isNaN(n))                          errs[f.name] = 'Must be a number'
        else if (f.min !== undefined && n < f.min) errs[f.name] = `Min ${f.min}`
        else if (f.max !== undefined && n > f.max) errs[f.name] = `Max ${f.max}`
      }
    })
    if (Object.keys(errs).length) setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }, [formData])

  const isSectionComplete = useCallback((sectionId) => {
    const section = FORM_SECTIONS.find(s => s.id === sectionId)
    return section.fields.every(f => {
      const val = formData[f.name]
      return val !== '' && val !== undefined && val !== null
    })
  }, [formData])

  const isAllComplete = FORM_SECTIONS.every(s => isSectionComplete(s.id))

  const submit = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const data = await predictFraud(formData)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [formData])

  const reset = useCallback(() => {
    setResult(null)
    setError(null)
    setFieldErrors({})
    setFormData(DEFAULT_VALUES)
  }, [])

  return {
    formData, result, loading, error, fieldErrors,
    updateField, loadPreset, validateSection,
    isSectionComplete, isAllComplete, submit, reset,
  }
}
