"use client"

import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import { FileText, Bookmark, Settings } from "lucide-react"

interface DraftData {
  id: string
  jobTitle: string
  formData?: {
    companyName?: string
  }
  savedAt: string
}

export default function Home() {
  const router = useRouter()
const [drafts, setDrafts] = useState<DraftData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedDrafts = localStorage.getItem("savedDrafts")
      if (savedDrafts) {
        setDrafts(JSON.parse(savedDrafts))
      }
    } catch (error) {
      console.error("Failed to load drafts:", error)
      // Silently fail - just show empty drafts
      setDrafts([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-text mb-4">Create Professional Job Posters</h1>
          <p className="text-xl text-text-muted max-w-2xl mx-auto mb-8">
            Design beautiful, eye-catching job postings in minutes. Choose from 6 professional templates and customize
            them to match your brand.
          </p>
          <button onClick={() => router.push("/form")} className="btn-primary text-lg px-8 py-3">
            Create New Poster
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="card">
            <FileText className="w-12 h-12 text-[#606C38] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Easy Forms</h3>
            <p className="text-text-muted">Fill in job details with our intuitive form. Auto-saves as you type.</p>
          </div>
          <div className="card">
            <Bookmark className="w-12 h-12 text-[#DDA15E] mb-4" />
            <h3 className="text-xl font-semibold mb-2">6 Templates</h3>
            <p className="text-text-muted">
              Choose from modern, professional, creative, minimal, bold, or tech designs.
            </p>
          </div>
          <div className="card">
            <Settings className="w-12 h-12 text-[#BC6C25] mb-4" />
            <h3 className="text-xl font-semibold mb-2">Customize</h3>
            <p className="text-text-muted">Adjust colors, fonts, and layouts to match your brand identity.</p>
          </div>
        </div>

        {/* Recent Drafts */}
        {!isLoading && drafts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Recent Drafts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.slice(0, 6).map((draft) => (
                <div
                  key={draft.id}
                  className="card cursor-pointer hover:border-[#606C38]"
                  onClick={() => router.push(`/form?draftId=${draft.id}`)}
                >
                  <h4 className="font-semibold text-lg mb-2">{draft.jobTitle}</h4>
                  <p className="text-text-muted text-sm mb-4">{draft.formData?.companyName}</p>
                  <p className="text-text-light text-xs">Saved {new Date(draft.savedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
