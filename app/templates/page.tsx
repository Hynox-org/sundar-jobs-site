"use client"

import { useState, Suspense, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/layout/header"
import { TEMPLATES } from "@/utils/templates"
import ModernTemplate from "@/components/templates/modern-template"
import ProfessionalTemplate from "@/components/templates/professional-template"
import CreativeTemplate from "@/components/templates/creative-template"
import MinimalistTemplate from "@/components/templates/minimalist-template"
import BoldTemplate from "@/components/templates/bold-template"
import TechTemplate from "@/components/templates/tech-template"
import { ChevronLeft, ChevronDown, Settings2, Check, ArrowRight } from "lucide-react"
import { useNotification } from "@/hooks/useNotification"

const templateComponents: { [key: string]: any } = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  minimalist: MinimalistTemplate,
  bold: BoldTemplate,
  tech: TechTemplate,
}

const templateIcons: { [key: string]: string } = {
  modern: "📄",
  professional: "💼",
  creative: "🎨",
  minimalist: "✨",
  bold: "⚡",
  tech: "🚀",
}

const templateTags: { [key: string]: string } = {
  modern: "Popular",
  professional: "Corporate",
  creative: "Trending",
  minimalist: "Clean",
  bold: "Dynamic",
  tech: "Innovation",
}

function TemplatesPageContent() {
  const router = useRouter()
  const { success, error } = useNotification()
  
  const [formData] = useState<any>(() => {
    try {
      const saved = localStorage.getItem("currentJobForm")
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>(() => {
    try {
      return localStorage.getItem("selectedTemplate") || "modern"
    } catch {
      return "modern"
    }
  })
  
  const [primaryColor, setPrimaryColor] = useState("#606C38")
  const [secondaryColor, setSecondaryColor] = useState("#DDA15E")
  const [fontFamily, setFontFamily] = useState("sans-serif")
  const [showCustomization, setShowCustomization] = useState(false)

  // Load saved customization on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("templateCustomization")
      if (saved) {
        const data = JSON.parse(saved)
        setPrimaryColor(data.primaryColor || "#606C38")
        setSecondaryColor(data.secondaryColor || "#DDA15E")
        setFontFamily(data.fontFamily || "sans-serif")
      }
    } catch (err) {
      console.error("Error loading saved settings:", err)
    }
  }, [])

  const handleTemplateSelect = useCallback(
    (templateId: string) => {
      try {
        setSelectedTemplate(templateId)
        localStorage.setItem("selectedTemplate", templateId)
        const template = TEMPLATES.find((t) => t.id === templateId)
        success(`Template selected: ${template?.name || templateId}`)
      } catch (err) {
        console.error("Error selecting template:", err)
        error("Failed to select template")
      }
    },
    [success, error],
  )

  const handleNext = useCallback(() => {
    try {
      localStorage.setItem("selectedTemplate", selectedTemplate)
      localStorage.setItem(
        "templateCustomization",
        JSON.stringify({
          primaryColor,
          secondaryColor,
          fontFamily,
        }),
      )
      success("Settings saved! Moving to preview...")
      setTimeout(() => router.push("/preview"), 500)
    } catch (err) {
      console.error("Error saving template:", err)
      error("Failed to save template settings")
    }
  }, [selectedTemplate, primaryColor, secondaryColor, fontFamily, success, error, router])

  const syncColorPicker = (colorValue: string, setter: (val: string) => void) => {
    if (/^#[0-9A-F]{6}$/i.test(colorValue)) {
      setter(colorValue)
    }
  }

  if (!formData) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-text-secondary mb-4">No form data found</p>
            <button onClick={() => router.push("/form")} className="btn btn--primary">
              Go to Form
            </button>
          </div>
        </div>
      </main>
    )
  }

  const TemplateComponent = templateComponents[selectedTemplate]

  return (
    <main className="bg-background">
      <Header />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Modern Stepper */}
        <div className="flex justify-center items-center gap-4 mb-12 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-success text-white flex items-center justify-center font-semibold text-sm shadow-sm">
              ✓
            </div>
            <span className="font-medium text-text hidden sm:inline">Form</span>
          </div>
          <div className="w-12 h-0.5 bg-border hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-sm shadow-md ring-4 ring-primary/10">
              2
            </div>
            <span className="font-semibold text-primary hidden sm:inline">Templates</span>
          </div>
          <div className="w-12 h-0.5 bg-border hidden sm:block"></div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-secondary text-text-secondary flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <span className="font-medium text-text-secondary hidden sm:inline">Preview</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-12">
          <button
            onClick={() => router.push("/form")}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold mb-4 px-4 py-2 rounded-lg hover:bg-primary/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{
              background: "linear-gradient(135deg, #606C38 0%, #DDA15E 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Choose Your Template
          </h1>
          <p className="text-lg text-text-secondary">
            Select a design that best represents your brand and job opportunity
          </p>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {TEMPLATES.map((tmpl, index) => {
            const isSelected = selectedTemplate === tmpl.id
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
                {/* Template Preview */}
                <div 
                  className="h-72 relative flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
                  }}
                >
                  <span className="text-6xl opacity-30">{templateIcons[tmpl.id]}</span>
                  
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
                  <p className="text-sm text-text-secondary mb-3 line-clamp-2">
                    {tmpl.description}
                  </p>
                  <span 
                    className="inline-block px-3 py-1 rounded-xl text-xs font-semibold"
                    style={{
                      background: "rgba(96, 108, 56, 0.1)",
                      color: "#606C38",
                    }}
                  >
                    {templateTags[tmpl.id]}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Customization Panel */}
        <div className="bg-surface rounded-2xl border border-border p-8 mb-12 shadow-sm">
          <button
            onClick={() => setShowCustomization(!showCustomization)}
            className="w-full flex items-center justify-between mb-6"
          >
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text">
              <Settings2 className="w-6 h-6" />
              Customize Colors & Fonts
            </h2>
            <div 
              className={`w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center transition-transform duration-300 ${
                showCustomization ? "rotate-180" : ""
              }`}
            >
              <ChevronDown className="w-5 h-5" />
            </div>
          </button>

          {showCustomization && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Color */}
              <div>
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-text">
                  Primary Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-15 h-12 rounded-lg cursor-pointer border-2 border-border hover:scale-105 transition-transform"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => syncColorPicker(e.target.value, setPrimaryColor)}
                    className="form-control flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-text">
                  Secondary Color
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-15 h-12 rounded-lg cursor-pointer border-2 border-border hover:scale-105 transition-transform"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => syncColorPicker(e.target.value, setSecondaryColor)}
                    className="form-control flex-1 font-mono text-sm"
                  />
                </div>
              </div>

              {/* Font Family */}
              <div>
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider text-text">
                  Font Family
                </label>
                <select 
                  value={fontFamily} 
                  onChange={(e) => setFontFamily(e.target.value)} 
                  className="form-control w-full"
                >
                  <option value="sans-serif">Sans Serif (Default)</option>
                  <option value="serif">Serif</option>
                  <option value="monospace">Monospace</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Section */}
        {TemplateComponent && (
          <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 text-text">Live Preview</h2>
              <p className="text-text-secondary">
                See how your customizations look in real-time
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
                  <TemplateComponent
                    formData={formData}
                    primaryColor={primaryColor}
                    secondaryColor={secondaryColor}
                    fontFamily={fontFamily}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between flex-wrap">
          <button 
            onClick={() => router.push("/form")} 
            className="btn btn--outline flex items-center gap-2"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Form
          </button>
          <button 
            onClick={handleNext} 
            className="btn btn--primary flex items-center gap-2"
          >
            Preview & Generate
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

export default function TemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <TemplatesPageContent />
    </Suspense>
  )
}
