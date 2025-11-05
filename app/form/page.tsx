"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Header from "@/components/layout/header"
import FormStep from "@/components/form/form-step"
import Stepper from "@/components/ui/stepper"
import { validateForm, getFormCompletion } from "@/utils/validation"
import { useFormPersist } from "@/hooks/useFormPersist"
import { useNotification } from "@/hooks/useNotification"

interface JobFormData {
  jobTitle: string
  companyName: string
  location: string
  salaryRange: string
  experienceRequired: string
  jobType: string
  jobDescription: string
  keyRequirements: string
  contactEmail: string
  contactPhone: string
  applicationDeadline: string
  companyLogoUrl: string
}

const initialFormData: JobFormData = {
  jobTitle: "",
  companyName: "",
  location: "",
  salaryRange: "",
  experienceRequired: "",
  jobType: "",
  jobDescription: "",
  keyRequirements: "",
  contactEmail: "",
  contactPhone: "",
  applicationDeadline: "",
  companyLogoUrl: "",
}

function FormPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const draftId = searchParams.get("draftId")
  const { success, error } = useNotification()

  const [formData, setFormData] = useState<JobFormData>(initialFormData)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [completion, setCompletion] = useState(0)

  // Auto-save form
  useFormPersist(formData)

  // Load draft if provided
  useEffect(() => {
    try {
      if (draftId) {
        const drafts = JSON.parse(localStorage.getItem("savedDrafts") || "[]")
        const draft = drafts.find((d: any) => d.id === draftId)
        if (draft) {
          setFormData(draft.formData)
        } else {
          error("Draft not found")
        }
      } else {
        const saved = localStorage.getItem("currentJobForm")
        if (saved) {
          setFormData(JSON.parse(saved))
        }
      }
    } catch (err) {
      console.error("Error loading form:", err)
      error("Failed to load form data")
    }
  }, [draftId])

  // Update completion percentage
  useEffect(() => {
    setCompletion(getFormCompletion(formData))
  }, [formData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSaveDraft = () => {
    try {
      const drafts = JSON.parse(localStorage.getItem("savedDrafts") || "[]")
      const newDraft = {
        id: draftId || Date.now().toString(),
        jobTitle: formData.jobTitle,
        savedAt: new Date().toISOString(),
        formData,
      }

      const existingIndex = drafts.findIndex((d: any) => d.id === draftId)
      if (existingIndex >= 0) {
        drafts[existingIndex] = newDraft
      } else {
        drafts.unshift(newDraft)
      }

      localStorage.setItem("savedDrafts", JSON.stringify(drafts))
      success("Draft saved successfully!")
    } catch (err) {
      console.error("Error saving draft:", err)
      error("Failed to save draft")
    }
  }

  const handleClear = () => {
    if (confirm("Are you sure you want to clear the form?")) {
      setFormData(initialFormData)
      localStorage.removeItem("currentJobForm")
      success("Form cleared!")
    }
  }

  const handleNext = () => {
    const formErrors = validateForm(formData)
    if (Object.keys(formErrors).length === 0) {
      try {
        localStorage.setItem("currentJobForm", JSON.stringify(formData))
        success("Moving to templates...")
        setTimeout(() => router.push("/templates"), 500)
      } catch (err) {
        console.error("Error saving form:", err)
        error("Failed to save form data")
      }
    } else {
      setErrors(formErrors)
      error("Please fix the errors before proceeding")
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stepper */}
        <Stepper currentStep={1} steps={["Form", "Templates", "Preview"]} />

        {/* Progress Bar */}
        <div className="mt-8 mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold">Form Completion</h2>
            <span className="text-sm text-text-muted">{completion}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all duration-300"
              style={{ width: `${completion}%`, backgroundColor: "#606C38" }}
            />
          </div>
        </div>

        {/* Form */}
        <FormStep formData={formData} errors={errors} onChange={handleChange} />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between mt-8">
          <div className="flex gap-4">
            <button onClick={handleSaveDraft} className="btn-tertiary">
              Save as Draft
            </button>
            <button onClick={handleClear} className="btn-tertiary">
              Clear Form
            </button>
          </div>
          <button onClick={handleNext} className="btn-primary">
            Next: Choose Template
          </button>
        </div>
      </div>
    </main>
  )
}

export default function FormPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <FormPageContent />
    </Suspense>
  )
}
