"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Header from "@/components/layout/header";
import {
  HTML_TEMPLATES,
  JobPostFormData,
  HtmlTemplate as TemplateType,
} from "@/constants/jobTemplates";

// Dynamically import HtmlTemplate to ensure it's client-side rendered
const DynamicHtmlTemplate = dynamic(() => import("@/components/HtmlTemplate"), {
  ssr: false,
  loading: () => <div className="text-gray-400">Loading template preview...</div>,
});
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { ChevronLeft, ArrowRight, Check } from "lucide-react";
import { useNotification } from "@/hooks/useNotification";

function PostTemplatesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId") || "";
  const supabase = createClientComponentClient();
  const { success, error: notifyError } = useNotification();

  const [formData, setFormData] = useState<JobPostFormData | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("template-1");

  // Fetch job from Supabase
  useEffect(() => {
    async function loadFormData() {
      if (!jobId) {
        notifyError("No job ID provided.");
        return;
      }
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();
      if (error || !data) {
        notifyError(`Could not load job data: ${error?.message || "Not found"}`);
        setFormData(null);
      } else {
        setFormData(data as JobPostFormData);
        if (data.template_id && HTML_TEMPLATES.some(t => t.id === data.template_id)) {
          setSelectedTemplateId(data.template_id);
        }
      }
    }
    loadFormData();
  }, [jobId, supabase, notifyError]);

  // Persist selection to Supabase immediately
  const handleTemplateSelect = useCallback(
    async (templateId: string) => {
      setSelectedTemplateId(templateId);
      if (!jobId) return;
      const { error } = await supabase
        .from("jobs")
        .update({ template_id: templateId })
        .eq("id", jobId);
      if (error) {
        notifyError("Failed to save template choice.");
      } else {
        success(`Template selected: ${HTML_TEMPLATES.find(t => t.id === templateId)?.name || templateId}`);
      }
    },
    [jobId, supabase, notifyError, success]
  );

  // Proceed to preview page with correct job & template refs
  const handlePreviewAndGenerate = useCallback(() => {
    if (formData && selectedTemplateId) {
      router.push(`/preview?jobId=${jobId}&templateId=${selectedTemplateId}`);
      success("Redirecting to preview...");
    } else {
      notifyError("Cannot generate preview: Missing job data or selected template.");
    }
  }, [formData, jobId, selectedTemplateId, router, success, notifyError]);

  if (!formData) {
    return (
      <main className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-500 mb-4">
              No job data found or an error occurred.
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

  const selectedTemplate =
    HTML_TEMPLATES.find((t) => t.id === selectedTemplateId) || HTML_TEMPLATES[0];
  return (
    <main className="bg-white">
      <Header />
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">

        {/* Page Header */}
        <div className="mb-12">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-primary hover:text-blue-600 font-semibold mb-4 px-4 py-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-gray-800">
            Preview Job Poster
          </h1>
          <p className="text-lg text-gray-500">
            Review your job details and choose a template for your poster.
          </p>
        </div>

        {/* Templates Grid */}
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-12">
          {HTML_TEMPLATES.map((tmpl, index) => {
            const isSelected = selectedTemplateId === tmpl.id;
            return (
              <div
                key={tmpl.id}
                onClick={() => handleTemplateSelect(tmpl.id)}
                className={`
                  cursor-pointer rounded-2xl overflow-hidden 
                  transition-all duration-300
                  ${isSelected
                    ? "ring-2 ring-blue-500 shadow-xl scale-105"
                    : "shadow-md hover:shadow-lg"
                  }
                  bg-white border border-gray-200
                `}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.07}s backwards`,
                }}
              >
                <div
                  className="h-48 flex items-center justify-center relative"
                  style={{
                    background: "linear-gradient(135deg, #fafafa 0%, #e8e8e8 100%)"
                  }}
                >
                  <span className="text-5xl text-gray-200 font-bold">{tmpl.name.charAt(0)}</span>
                  {isSelected && (
                    <div
                      className="absolute top-3 right-3 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md"
                      style={{
                        animation: "bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)"
                      }}
                    >
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-gray-100">
                  <h3 className="text-lg font-bold mb-1 text-gray-800">{tmpl.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
        {/* Live Preview Section */}
        <section className="w-full flex flex-col items-center justify-center rounded-2xl shadow">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Live Template Preview</h2>
            <p className="text-gray-600">This is a dynamic preview of your selected template.</p>
          </div>
          <div className="flex justify-center w-full h-auto">
            <div
              className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 mx-auto"
              style={{
                width: "98%", // will shrink on sm screens
                height: "auto",
                maxWidth: "100vw",
                aspectRatio: "210 / 297"
              }}
            >
              <DynamicHtmlTemplate formData={formData} template={selectedTemplate} />
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-between flex-wrap mt-8 mb-8">
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
          from { opacity: 0; transform: translateY(20px);}
          to { opacity: 1; transform: translateY(0);}
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0);}
          50% { transform: scale(1.1);}
          100% {opacity:1;transform:scale(1);}
        }
      `}</style>
    </main>
  );
}

// Export default page with Suspense fallback
export default function PostTemplatesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>}>
      <PostTemplatesPageContent />
    </Suspense>
  );
}
