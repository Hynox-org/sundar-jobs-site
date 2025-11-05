"use client"

import { useEffect, useRef, useCallback } from "react"

interface FormData {
  [key: string]: any
}

export function useFormPersist(formData: FormData, key = "currentJobForm", delay = 2000) {
  const timeoutRef = useRef<NodeJS.Timeout>()

  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(key, JSON.stringify(formData))
    } catch (error) {
      console.error("Failed to save form data:", error)
    }
  }, [formData, key])

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(saveToStorage, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [formData, saveToStorage, delay])

  return saveToStorage
}
