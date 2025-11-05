"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import { Trash2, Copy, FileText, Calendar, ArrowRight } from "lucide-react"
import { StorageUtils, type Draft } from "@/utils/storage"
import { useNotification } from "@/hooks/useNotification"

export default function DraftsPage() {
  const router = useRouter()
  const { success, error } = useNotification()
  const hasInitialized = useRef(false)
  const [drafts, setDrafts] = useState<Draft[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    try {
      loadDrafts()
    } catch (err) {
      console.error("Error loading drafts:", err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const loadDrafts = () => {
    const allDrafts = StorageUtils.getAllDrafts()
    setDrafts(allDrafts)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this draft?")) {
      try {
        StorageUtils.deleteDraft(id)
        loadDrafts()
        success("Draft deleted")
      } catch (err) {
        console.error("Error deleting draft:", err)
        error("Failed to delete draft")
      }
    }
  }

  const handleDuplicate = (id: string) => {
    try {
      StorageUtils.duplicateDraft(id)
      loadDrafts()
      success("Draft duplicated!")
    } catch (err) {
      console.error("Error duplicating draft:", err)
      error("Failed to duplicate draft")
    }
  }

  const handleLoad = (id: string) => {
    try {
      router.push(`/form?draftId=${id}`)
    } catch (err) {
      console.error("Error loading draft:", err)
      error("Failed to load draft")
    }
  }

  const filteredDrafts = drafts.filter((d) => d.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Saved Drafts</h1>
          <button onClick={() => router.push("/form")} className="btn-primary">
            Create New
          </button>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search drafts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-full"
          />
        </div>

        {/* Drafts List */}
        {!isLoading && filteredDrafts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-text-muted mx-auto mb-4" />
            <p className="text-text-muted mb-4">{searchTerm ? "No drafts found" : "No saved drafts yet"}</p>
            <button onClick={() => router.push("/form")} className="btn-primary">
              Create Your First Poster
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDrafts.map((draft) => (
              <div key={draft.id} className="card hover:border-[#606C38] group">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-text truncate">{draft.jobTitle}</h3>
                  <p className="text-sm text-text-muted">{draft.formData?.companyName}</p>
                </div>

                <div className="flex items-center gap-2 text-xs text-text-muted mb-4">
                  <Calendar className="w-4 h-4" />
                  {new Date(draft.savedAt).toLocaleDateString()} at{" "}
                  {new Date(draft.savedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleLoad(draft.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-white rounded-lg transition-colors text-sm font-semibold"
                    style={{
                      backgroundColor: "#606C38",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#3E4620")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#606C38")}
                  >
                    <ArrowRight className="w-4 h-4" />
                    Load
                  </button>
                  <button
                    onClick={() => handleDuplicate(draft.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-white rounded-lg transition-colors text-sm font-semibold"
                    style={{
                      backgroundColor: "#DDA15E",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C4872B")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#DDA15E")}
                  >
                    <Copy className="w-4 h-4" />
                    Clone
                  </button>
                  <button
                    onClick={() => handleDelete(draft.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 text-white rounded-lg transition-colors text-sm font-semibold"
                    style={{
                      backgroundColor: "#BC6C25",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#8D4D18")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#BC6C25")}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
