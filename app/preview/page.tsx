"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import Stepper from "@/components/ui/stepper"
import ModernTemplate from "@/components/templates/modern-template"
import ProfessionalTemplate from "@/components/templates/professional-template"
import CreativeTemplate from "@/components/templates/creative-template"
import MinimalistTemplate from "@/components/templates/minimalist-template"
import BoldTemplate from "@/components/templates/bold-template"
import TechTemplate from "@/components/templates/tech-template"
import { Download, Share2, Edit, ZoomIn, ZoomOut, Smartphone, Monitor } from "lucide-react"
import { POSTER_SIZES } from "@/hooks/usePosterGeneration"
import { useNotification } from "@/hooks/useNotification"

const templateComponents: { [key: string]: any } = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  minimalist: MinimalistTemplate,
  bold: BoldTemplate,
  tech: TechTemplate,
}

function PreviewPageContent() {
  const router = useRouter()
  const { success, error, loading } = useNotification()
  const hasInitialized = useRef(false)
  const posterRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState("modern")
  const [customization, setCustomization] = useState<any>({
    primaryColor: "#606C38",
    secondaryColor: "#DDA15E",
    fontFamily: "sans-serif",
  })
  const [zoom, setZoom] = useState(100)
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop")
  const [selectedSize, setSelectedSize] = useState("instagram")
  const [quality, setQuality] = useState<"low" | "medium" | "high">("high")
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    try {
      const saved = localStorage.getItem("currentJobForm")
      const template = localStorage.getItem("selectedTemplate")
      const custom = localStorage.getItem("templateCustomization")

      if (saved) setFormData(JSON.parse(saved))
      else {
        setTimeout(() => router.push("/form"), 2000)
        return
      }
      if (template) setSelectedTemplate(template)
      if (custom) setCustomization(JSON.parse(custom))
    } catch (err) {
      console.error("Error loading preview:", err)
      setTimeout(() => router.push("/form"), 2000)
    }
  }, [])

  const handleDownload = async (format: "png" | "jpg") => {
    if (!posterRef.current) {
      error("Failed to generate poster")
      return
    }

    setIsGenerating(true)
    try {
      const { generatePosterImage, downloadImage } = await import("@/hooks/usePosterGeneration")
      const size = POSTER_SIZES[selectedSize]
      const dataUrl = await generatePosterImage(posterRef.current, size.width, size.height, quality)
      downloadImage(dataUrl, `job-poster-${Date.now()}`, format)
      success(`Poster downloaded as ${format.toUpperCase()}!`)
    } catch (err) {
      console.error("Download error:", err)
      error(`Failed to download ${format.toUpperCase()} poster`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Job Poster",
          text: `Check out this job posting for ${formData?.jobTitle}`,
        })
        success("Shared successfully!")
      } else {
        error("Share not supported on this device")
      }
    } catch (err: any) {
      if (err.name !== "AbortError") {
        console.error("Share error:", err)
        error("Failed to share poster")
      }
    }
  }

  if (!formData) return null

  const TemplateComponent = templateComponents[selectedTemplate]

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Stepper currentStep={3} steps={["Form", "Templates", "Preview"]} />

        <h1 className="text-3xl font-bold mt-8 mb-8">Your Job Poster</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Preview */}
          <div className="lg:col-span-3">
            <div
              className="bg-gray-200 rounded-xl overflow-auto flex items-center justify-center"
              style={{
                height: previewMode === "mobile" ? "600px" : "500px",
                maxWidth: previewMode === "mobile" ? "300px" : "none",
              }}
            >
              <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
                <div ref={posterRef} className="w-[400px] h-[400px]">
                  <TemplateComponent
                    formData={formData}
                    primaryColor={customization.primaryColor}
                    secondaryColor={customization.secondaryColor}
                    fontFamily={customization.fontFamily}
                  />
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="mt-4 flex gap-2 justify-between items-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setZoom(Math.max(25, zoom - 10))}
                  className="p-2 hover:bg-surface rounded-lg transition-colors"
                >
                  <ZoomOut className="w-5 h-5" />
                </button>
                <span className="px-3 py-2 bg-surface rounded-lg text-sm font-semibold">{zoom}%</span>
                <button
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                  className="p-2 hover:bg-surface rounded-lg transition-colors"
                >
                  <ZoomIn className="w-5 h-5" />
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewMode("desktop")}
                  className={`p-2 rounded-lg transition-colors ${
                    previewMode === "desktop" ? "bg-[#606C38] text-white" : "hover:bg-surface"
                  }`}
                >
                  <Monitor className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPreviewMode("mobile")}
                  className={`p-2 rounded-lg transition-colors ${
                    previewMode === "mobile" ? "bg-[#606C38] text-white" : "hover:bg-surface"
                  }`}
                >
                  <Smartphone className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar Controls */}
          <div className="space-y-6">
            {/* Size Selection */}
            <div className="bg-surface rounded-xl border border-border p-4">
              <h3 className="font-bold mb-3">Poster Size</h3>
              <select
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="input-field w-full"
              >
                {Object.entries(POSTER_SIZES).map(([key, size]) => (
                  <option key={key} value={key}>
                    {size.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quality Selection */}
            <div className="bg-surface rounded-xl border border-border p-4">
              <h3 className="font-bold mb-3">Export Quality</h3>
              <div className="space-y-2">
                {["low", "medium", "high"].map((q) => (
                  <label key={q} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="quality"
                      value={q}
                      checked={quality === q}
                      onChange={(e) => setQuality(e.target.value as any)}
                      className="w-4 h-4"
                    />
                    <span className="capitalize text-sm">{q}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Download Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleDownload("png")}
                disabled={isGenerating}
                className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isGenerating ? "Generating..." : "PNG"}
              </button>
              <button
                onClick={() => handleDownload("jpg")}
                disabled={isGenerating}
                className="w-full btn-secondary flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isGenerating ? "Generating..." : "JPG"}
              </button>
            </div>

            {/* Share Button */}
            <button onClick={handleShare} className="w-full btn-tertiary flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {/* Edit Button */}
            <button
              onClick={() => router.push("/templates")}
              className="w-full flex items-center justify-center gap-2 p-2 hover:bg-surface rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              Edit Template
            </button>

            {/* Create New */}
            <button
              onClick={() => {
                localStorage.removeItem("currentJobForm")
                router.push("/")
              }}
              className="w-full btn-tertiary"
            >
              Create New
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default function PreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PreviewPageContent />
    </Suspense>
  )
}
