export interface Draft {
  id: string
  jobTitle: string
  savedAt: string
  formData: any
}

export const StorageUtils = {
  // Drafts Management
  saveDraft: (formData: any): string => {
    const drafts = StorageUtils.getAllDrafts()
    const newDraft: Draft = {
      id: Date.now().toString(),
      jobTitle: formData.jobTitle || "Untitled Job",
      savedAt: new Date().toISOString(),
      formData,
    }
    drafts.unshift(newDraft)
    // Limit to 30 drafts
    const limitedDrafts = drafts.slice(0, 30)
    localStorage.setItem("savedDrafts", JSON.stringify(limitedDrafts))
    return newDraft.id
  },

  getAllDrafts: (): Draft[] => {
    try {
      const drafts = localStorage.getItem("savedDrafts")
      return drafts ? JSON.parse(drafts) : []
    } catch {
      return []
    }
  },

  getDraft: (id: string): Draft | null => {
    const drafts = StorageUtils.getAllDrafts()
    return drafts.find((d) => d.id === id) || null
  },

  deleteDraft: (id: string): void => {
    const drafts = StorageUtils.getAllDrafts()
    const filtered = drafts.filter((d) => d.id !== id)
    localStorage.setItem("savedDrafts", JSON.stringify(filtered))
  },

  duplicateDraft: (id: string): string => {
    const draft = StorageUtils.getDraft(id)
    if (!draft) return ""
    return StorageUtils.saveDraft(draft.formData)
  },

  // Data Export/Import
  exportData: (): string => {
    const drafts = StorageUtils.getAllDrafts()
    const preferences = localStorage.getItem("userPreferences")
    return JSON.stringify(
      {
        drafts,
        preferences: preferences ? JSON.parse(preferences) : {},
        exportedAt: new Date().toISOString(),
      },
      null,
      2,
    )
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData)
      if (data.drafts && Array.isArray(data.drafts)) {
        localStorage.setItem("savedDrafts", JSON.stringify(data.drafts))
      }
      if (data.preferences) {
        localStorage.setItem("userPreferences", JSON.stringify(data.preferences))
      }
      return true
    } catch {
      return false
    }
  },

  clearAllData: (): void => {
    localStorage.removeItem("currentJobForm")
    localStorage.removeItem("savedDrafts")
    localStorage.removeItem("selectedTemplate")
    localStorage.removeItem("templateCustomization")
    localStorage.removeItem("userPreferences")
  },
}
