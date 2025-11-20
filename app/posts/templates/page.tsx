"use client"

import { useState, Suspense, useCallback, useEffect } from "react"
import { useRouter, useLocalSearchParams } from "expo-router"
import Header from "@/components/layout/header"
import HtmlTemplate from "@/components/HtmlTemplate"
import { HTML_TEMPLATES, JobPostFormData, HtmlTemplate as TemplateType } from "@/constants/jobTemplates"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ChevronLeft, ArrowRight, Check } from "lucide-react"
import { useNotification } from "@/hooks/useNotification"
import { Spinner } from "@/components/ui/spinner"


function PostTemplatesPageContent() {
  const router = useRouter()
  const { jobId } = useLocalSearchParams<{ jobId?: string }>()
  const supabase = createClientComponentClient()
  const { success, error } = useNotification()

  const [formData, setFormData] = useState<JobPostFormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    try {
      return localStorage.getItem("selectedTemplate") || "template-1"
    } catch {
      return "template-1"
    }
  })

  useEffect(() => {
    async function fetchJobData() {
      if (!jobId) {
        setLoading(false)
        error("No Job ID provided.")
        return
      }
      try {
        const { data, error: fetchError } = await supabase
          .from("job_post")
          .select("*")
          .eq("id", jobId)
          .single()

        if (fetchError) {
          error(`Failed to fetch job data: ${fetchError.message}`)
          setFormData(null)
        } else if (data) {
          setFormData(data as JobPostFormData)
          // Also set the selected template from job data if available, otherwise use default
          if (data.template_id && HTML_TEMPLATES.some(t => t.id === data.template_id)) {
            setSelectedTemplateId(data.template_id);
          }
          success("Job data loaded successfully.")
        } else {
          error("No job data found for the provided ID.")
          setFormData(null)
        }
      } catch (err) {
        console.error("Error fetching job data:", err)
        error("An unexpected error occurred while fetching job data.")
        setFormData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchJobData()
  }, [jobId, supabase, success, error])

  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      setSelectedTemplateId(templateId)
      // Optionally save to local storage, though for public posts, it might not be necessary
      // localStorage.setItem("selectedTemplate", templateId)
      const template = HTML_TEMPLATES.find((t) => t.id === templateId)
      success(`Template selected: ${template?.name || templateId}`)
    },
    [success],
  )

  const handlePreviewAndGenerate = useCallback(() => {
    // For this route, we might not need to save to local storage as it's a public view/generation
    // The actual generation logic would likely happen on a server or a dedicated endpoint.
    if (formData && selectedTemplateId) {
        // Here you would typically trigger the generation of the final image/PDF
        // and then redirect to a preview page for that generated asset.
        // For now, we'll simulate by redirecting to a generic preview.
        router.push(`/preview?jobId=${jobId}&templateId=${selectedTemplateId}`);
        success("Redirecting to preview/generation...");
    } else {
        error("Cannot generate preview: Missing job data or selected template.");
    }
  }, [formData, jobId, selectedTemplateId, router, success, error])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="h-8 w-8" />
        <p className="text-text-secondary ml-4">Loading job details...</p>
      </main>
    )
  }

  if (!formData) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-text-secondary mb-4">No job data found or an error occurred.</p>
            <button onClick={() => router.push("/alljobs")} className="btn btn--primary">
              Go to All Jobs
            </button>
          </div>
        </div>
      </main>
    )
  }

  const selectedTemplate = HTML_TEMPLATES.find(t => t.id === selectedTemplateId) || HTML_TEMPLATES[0];

  return (
    <main className="bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-12">
          <button
            onClick={() => router.back()} // Go back to the previous page
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold mb-4 px-4 py-2 rounded-lg hover:bg-primary/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1
            className="text-4xl md:text-5xl font-bold mb-3 text-text" // Changed to text-text
          >
            Preview Job Poster
          </h1>
          <p className="text-lg text-text-secondary">
            Review your job details and choose a template for your poster.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {HTML_TEMPLATES.map((tmpl, index) => {
            const isSelected = selectedTemplateId === tmpl.id
            return (
              <div
                key={tmpl.id}
                onClick={() => handleTemplateSelect(tmpl.id)}
                className={`
                  cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 transform
                  ${isSelected
                    ? "ring-2 ring-primary shadow-xl scale-[1.02]"
                    : "shadow-md hover:shadow-xl hover:-translate-y-2"
                  }
                  bg-surface
                `}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s backwards`,
                }}
              >
                {/* Template Preview - simplified, as we're not showing actual rendered HTML here */}
                <div
                  className="h-72 relative flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
                  }}
                >
                  <span className="text-6xl opacity-30">{tmpl.name.charAt(0)}</span>

                  {/* Selected Badge */}
                  {isSelected && (
                    <div
                      className="absolute top-4 right-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md"
                      style={{
                        animation: "bounceIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div className="p-6 border-t border-border">
                  <h3 className="text-xl font-bold mb-2 text-text">{tmpl.name}</h3>
                </div>
              </div>
            )
          })}
        </div>

        {/* Live Preview Section */}
        {formData && selectedTemplate ? (
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-text">Live Template Preview</h2>
              <p className="text-text-secondary">
                This is a dynamic preview of your selected template.
              </p>
            </div>
            <div
              className="rounded-xl p-12 flex justify-center items-center overflow-auto"
              style={{
                background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
              }}
            >
              <div className="w-fit flex flex-start">
                <div
                  className="bg-white rounded-xl shadow-xl"
                  style={{
                    transformOrigin: "top center",
                  }}
                >
                  <HtmlTemplate
                    formData={formData}
                    template={selectedTemplate}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-text-secondary py-12">
            <p>Select a template to see a live preview.</p>
          </div>
        )}


        {/* Action Buttons */}
        <div className="flex gap-4 justify-between flex-wrap">
          <button
            onClick={() => router.back()}
            className="btn btn--outline flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button
            onClick={handlePreviewAndGenerate}
            className="btn btn--primary flex items-center gap-2"
          >
            Continue to Poster Generation
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Responsive scaling for large templates (1080x1920) */
        @media (max-width: 1400px) {
          .bg-white.rounded-xl.shadow-xl {
            transform: scale(0.8);
          }
        }

        @media (max-width: 1200px) {
          .bg-white.rounded-xl.shadow-xl {
            transform: scale(0.6);
          }
        }

        @media (max-width: 900px) {
          .bg-white.rounded-xl.shadow-xl {
            transform: scale(0.45);
          }
        }

        @media (max-width: 768px) {
          .bg-white.rounded-xl.shadow-xl {
            transform: scale(0.35);
          }
        }

        @media (max-width: 480px) {
          .bg-white.rounded-xl.shadow-xl {
            transform: scale(0.25);
          }
        }
      `}</style>
    </main>
  )
}

export default function PostTemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PostTemplatesPageContent />
    </Suspense>
  )
}
