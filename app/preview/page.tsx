"use client";

import { useState, useEffect, useCallback, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/layout/header";
import HtmlTemplate from "@/components/HtmlTemplate";
import {
  HTML_TEMPLATES,
  JobPostFormData,
  HtmlTemplate as TemplateType,
} from "@/constants/jobTemplates";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";
import { Spinner } from "@/components/ui/spinner";
import { generatePosterFromElement, POSTER_SIZES, PosterSize } from "@/hooks/usePosterGeneration";

function JobPreviewPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") || "";
  const templateId = searchParams.get("templateId") || "";
  const supabase = createClientComponentClient();
  const { success, error: notifyError } = useNotification();

  const [formData, setFormData] = useState<JobPostFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPosterSizeId, setSelectedPosterSizeId] = useState<string>("instagram");

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadFormData() {
      setLoading(true);
      setLoadError(null);
      if (!jobId || !templateId) {
        setLoadError("Missing job ID or template ID for preview.");
        setFormData(null);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();
      if (error || !data) {
        setLoadError(`Could not load job data: ${error?.message || "Not found"}`);
        setFormData(null);
      } else {
        setFormData(data as JobPostFormData);
      }
      setLoading(false);
    }
    loadFormData();
  }, [jobId, templateId, supabase]);

  const handleGeneratePoster = useCallback(async () => {
    if (!formData || !templateId || !previewRef.current) {
      notifyError("Cannot generate poster: Missing job data, template ID, or preview element.");
      return;
    }
    setIsGenerating(true);
    const selectedSize = POSTER_SIZES[selectedPosterSizeId];
    if (!selectedSize) {
      notifyError("Invalid poster size selected.");
      setIsGenerating(false);
      return;
    }

    try {
      const posterUrl = await generatePosterFromElement(previewRef.current, selectedSize);
      if (posterUrl) {
        const { error: updateError } = await supabase
          .from("jobs")
          .update({ poster_url: posterUrl })
          .eq("id", jobId);
        if (updateError) {
          notifyError("Failed to save poster URL.");
        } else {
          success("Poster generated and saved!");
          router.push(`/posts/success?jobId=${jobId}`);
        }
      } else {
        notifyError("Failed to generate poster.");
      }
    } catch (err) {
      console.error("Error generating poster:", err);
      notifyError("An unexpected error occurred during poster generation.");
    } finally {
      setIsGenerating(false);
    }
  }, [formData, templateId, jobId, supabase, notifyError, success, router, selectedPosterSizeId]);


  const selectedTemplate = HTML_TEMPLATES.find((t) => t.id === templateId);

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <Spinner width={32} height={32} />
        <p className="text-text-secondary ml-4">Loading preview...</p>
      </main>
    );
  }

  if (!formData || !selectedTemplate || loadError) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-text-secondary mb-4">
              Error loading preview: {loadError || "Missing job data or invalid template."}
            </p>
            <button
              onClick={() => router.push("/alljobs")}
              className="btn btn--primary"
            >
              Go to All Jobs
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-background">
      <Header />
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-12 mt-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold mb-4 px-4 py-2 rounded-lg hover:bg-primary/5 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back to Template Selection
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-text">
            Final Poster Preview
          </h1>
          <p className="text-lg text-text-secondary">
            This is how your job poster will look. Generate it if you're happy!
          </p>
        </div>
{/* Action Buttons */}
        <div className="flex gap-4 justify-between flex-wrap">
          
          <button
          
            className="btn btn--primary flex items-center gap-2"
            disabled={isGenerating || !formData || !selectedTemplate}
          >
            {isGenerating ? (
              <>
                <Spinner className="h-5 w-5 mr-2" />
                Generating PDF...
              </>
            ) : (
              <>
                <ArrowLeft className="w-4 h-4" />
                Generate PDF
              </>
            )}
          </button>
        </div>
        {/* Live Preview Section */}
        <div className="bg-surface rounded-2xl border border-border p-8 shadow-sm mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-text">
              Live Poster Preview
            </h2>
            <p className="text-text-secondary">
              Review the final look before generating.
            </p>
          </div>
          <div className="flex justify-center mb-4">
            {/* Poster Size Selector */}
            <select
              value={selectedPosterSizeId}
              onChange={(e) => setSelectedPosterSizeId(e.target.value)}
              className="p-2 border rounded-md"
            >
              {Object.entries(POSTER_SIZES).map(([key, size]) => (
                <option key={key} value={key}>
                  {size.name} ({size.width}x{size.height}px)
                </option>
              ))}
            </select>
          </div>
          
          <div
            className="relative p-4 flex justify-center items-center" /* Reduced padding */
            style={{
              background: "linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)",
              minWidth: "75%", // Ensure a minimum height for the preview area
            }}
          >
            <div className="flex-1 flex justify-center items-center p-2"> {/* Flexible inner container */}
              <div
                ref={previewRef}
                className="bg-white rounded-xl shadow-xl overflow-hidden" /* Added overflow-hidden */
                style={{
                  transformOrigin: "center center",
                  transform: "scale(var(--scale-factor, 0.5))", /* Dynamic scaling */
                  width: "100%", /* Max width of container, but limited to A4 */
                  height: '100%',
                  aspectRatio: '210 / 297', /* Maintain A4 aspect ratio */
                  boxSizing: 'content-box', /* Ensure padding/border doesn't mess with width */
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
        <div className="mt-8 flex justify-center">
            <button
              className="btn btn--primary bg-amber-700 p-5 flex items-center gap-2"
            >
              Post the Job
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
        /* Responsive scaling for the template preview */
        .bg-white.rounded-xl.shadow-xl {
          --scale-factor: 0.5; /* Default scale */
        }
        @media (max-width: 1400px) {
          .bg-white.rounded-xl.shadow-xl { --scale-factor: 0.45; }
        }
        @media (max-width: 1200px) {
          .bg-white.rounded-xl.shadow-xl { --scale-factor: 0.4; }
        }
        @media (max-width: 1024px) { /* Tailor for medium screens */
          .bg-white.rounded-xl.shadow-xl { --scale-factor: 0.35; }
        }
        @media (max-width: 900px) {
          .bg-white.rounded-xl.shadow-xl { --scale-factor: 0.3; }
        }
        @media (max-width: 768px) { /* Tailor for small screens */
          .bg-white.rounded-xl.shadow-xl { --scale-factor: 0.25; }
        }
        @media (max-width: 600px) {
          .bg-white.rounded-xl.shadow-xl { --scale-factor: 0.2; }
        }
      `}</style>
    </main>
  );
}

// Export default page with Suspense fallback
export default function JobPreviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>}>
      <JobPreviewPageContent />
    </Suspense>
  );
}

