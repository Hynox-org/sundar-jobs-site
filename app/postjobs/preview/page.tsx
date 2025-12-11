'use client';

import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text as RNText,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import generateHtmlTemplate from "@/components/HtmlTemplate";
import { HTML_TEMPLATES, HtmlTemplate } from "@/constants/jobTemplates";

interface JobPostFormData {
  id?: string;
  title: string;
  job_title: string;
  vacancy: number;
  job_type: string;
  category: string;
  experience: string;
  salary: string;
  job_description: string;
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  application_deadline: string;
  additional_info: string;
  is_draft?: boolean;
  template_id?: string;
  template_style?: string;
  poster_url?: string;
  additional_jobs?: {
    job_title: string;
    vacancy: number;
    experience: string;
  }[];
}

export default function PreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams?.get("jobId");
  const templateId = searchParams?.get("templateId");

  const [formData, setFormData] = useState<JobPostFormData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<HtmlTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsAuthenticated(!!session);

      if (session) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (profile) {
          setIsAdmin(profile.role === "admin");
        }
      }
    };

    fetchSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setIsAuthenticated(!!session);
      if (session) {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (profile) {
          setIsAdmin(profile.role === "admin");
        }
      } else {
        setIsAdmin(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const loadJobPost = async () => {
      if (!jobId) {
        console.error("No jobId provided for preview.");
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .single();

        if (error) throw error;

        setFormData(data || null);
      } catch (e) {
        console.error("Error loading job post from Supabase:", e);
        alert("Failed to load job post.");
      }

      if (templateId) {
        const template = HTML_TEMPLATES.find(
          (t: HtmlTemplate) => t.id === templateId
        );
        setSelectedTemplate(template || null);
      }
      setLoading(false);
    };

    loadJobPost();
  }, [jobId, templateId]);

  const handleLoginRedirect = () => {
    if (confirm("Please log in to view the full preview and request posting. Go to login?")) {
      router.push("/auth/authenticate");
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  // Helper function to convert HTML to PDF blob (web alternative)
  const htmlToPdfBlob = async (html: string): Promise<Blob> => {
    // Dynamically import jsPDF and html2canvas (browser-only)
    const [{ jsPDF }, html2canvas] = await Promise.all([
      import("jspdf"),
      import("html2canvas"),
    ]);

    const doc = new jsPDF();

    // Create a temporary div to render HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.style.width = "210mm"; // A4 width
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas.default(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      return doc.output("blob");
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  const sharePdf = async () => {
    try {
      const htmlContent =
        formData && selectedTemplate
          ? generateHtmlTemplate({
              formData,
              template: selectedTemplate,
            })
          : "<h1>Loading...</h1>";

      if (!htmlContent) {
        alert("Job post content not ready");
        return;
      }

      // For web, create a download link
      const blob = await htmlToPdfBlob(htmlContent);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `job-post-${formData?.id || 'unknown'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      alert(`Share Error: ${error.message}`);
      console.log(error);
    }
  };

  const shareOnWhatsApp = async () => {
    if (!formData) {
      alert("Job data not available.");
      return;
    }

    const item = formData;

    const viewDetailsUrl =
      item.poster_url ||
      `https://sundarjobs.com/posts/preview?jobId=${item.id}&templateId=${
        item.template_id || ""
      }&templateStyle=${item.template_style || ""}`;

    let fullShareMessage = "";

    fullShareMessage += `${item.job_title} - ${item.vacancy} No`;
    if (item.experience) {
      fullShareMessage += `\n(${item.experience} Experience)`;
    }
    fullShareMessage += "\n";

    if (item.additional_jobs && item.additional_jobs.length > 0) {
      item.additional_jobs.forEach((adj) => {
        fullShareMessage += `\n${adj.job_title} - ${adj.vacancy} No`;
        if (adj.experience) {
          fullShareMessage += `\n(${adj.experience} Experience)`;
        }
      });
      fullShareMessage += "\n";
    }

    if (item.company_address) {
      fullShareMessage += `\n location:${item.company_address}`;
    }

    if (item.company_email) {
      fullShareMessage += `\nSend Your Resume Thru Mail:\n${item.company_email}`;
    }

    if (item.company_phone) {
      fullShareMessage += `\nCall us : ${item.company_phone}`;
    }

    if (viewDetailsUrl) {
      fullShareMessage += `\n\n🔗 ${viewDetailsUrl}`;
    }

    fullShareMessage += `\n\n🔥🔥👇👇🔥🔥`;
    fullShareMessage += `\nFollow Our WhatsApp Channel( What's App la Follow Up பண்ணுற Option வந்துருச்சு )`;
    fullShareMessage += `\n\nhttps://whatsapp.com/channel/0029Va9NPxE2v1Iz9yMDVL3r`;
    fullShareMessage += `\n\nDownload App - Play Store Sankar Jobs https://play.google.com/store/apps/details?id=com.sankarjobs.app&hl=en_IN`;
    fullShareMessage += `\n\nDownload Apple App Store: https://apps.apple.com/in/app/sankar-jobs/id6741199664`;
    fullShareMessage += `\n\nOur Website\nhttp://www.sundarjobs.com`;
    fullShareMessage += `\n\nPlz share Your Friends 🙏`;

    // For web, open WhatsApp Web with pre-filled message
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullShareMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handlePostJob = async () => {
    if (!formData || !selectedTemplate || !session) {
      alert("Job post data or session is missing.");
      return;
    }

    setIsPostingJob(true);
    try {
      const htmlContent = generateHtmlTemplate({
        formData: formData,
        template: selectedTemplate,
      });

      // Generate PDF blob
      const pdfBlob = await htmlToPdfBlob(htmlContent);

      const fileName = `poster-${formData.id}-${Date.now()}.pdf`;
      const filePath = `posters/${fileName}`;

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from("sundarjobs")
        .upload(filePath, pdfBlob, {
          contentType: "application/pdf",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("sundarjobs")
        .getPublicUrl(filePath);

      if (!publicUrlData?.publicUrl) {
        throw new Error("Could not get public URL for the uploaded file.");
      }

      // Update job data
      const { error: updateError } = await supabase
        .from("jobs")
        .update({
          is_draft: false,
          poster_url: publicUrlData.publicUrl,
        })
        .eq("id", formData.id);

      if (updateError) throw updateError;

      setFormData((prev) => ({
        ...prev!,
        is_draft: false,
        poster_url: publicUrlData.publicUrl,
      }));

      alert("Job poster uploaded and job posted successfully!");
      router.push("/");
    } catch (error: any) {
      alert(`Post Job Error: ${error.message}`);
      console.error("Post Job Error:", error);
    } finally {
      setIsPostingJob(false);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  if (loading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: "#F9FAFB" }]}>
        <ActivityIndicator size="large" color="#2563EB" />
        <RNText style={[styles.loadingText, { color: "#6B7280" }]}>
          Preparing job post preview...
        </RNText>
      </View>
    );
  }

  if (!formData || !selectedTemplate) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: "#F9FAFB" }]}>
        <RNText style={[styles.errorText, { color: "#111827" }]}>
          Could not load job post preview.
        </RNText>
        <TouchableOpacity
          style={[styles.backButton, { marginTop: 20 }]}
          onPress={() => router.back()}
        >
          <RNText style={{ color: "#2563EB", fontWeight: "600" }}>Go Back</RNText>
        </TouchableOpacity>
      </View>
    );
  }

  const htmlContent: string =
    formData && selectedTemplate
      ? generateHtmlTemplate({
          formData: formData,
          template: selectedTemplate,
        })
      : "<h1>Loading...</h1>";

  // Format zoom percentage as string
  const zoomPercentage: string = `${Math.round(zoom * 100)}%`;
  const jobTitle: string = formData.job_title || "Job Preview";

  return (
    <View style={[styles.container, { backgroundColor: "#F9FAFB" }]}>
      {isPostingJob && (
        <View style={[StyleSheet.absoluteFill, styles.overlay]}>
          <View
            style={[
              styles.centeredContainer,
              { backgroundColor: "transparent" },
            ]}
          >
            <ActivityIndicator size="large" color="#2563EB" />
            <RNText style={[styles.loadingText, { color: "#374151" }]}>
              Posting job...
            </RNText>
          </View>
        </View>
      )}

      {/* Top Control Bar */}
      <View
        style={[
          styles.topControls,
          {
            backgroundColor: "#FFFFFF",
            borderBottomColor: "#E5E7EB",
          },
        ]}
      >
        <View style={styles.zoomControls}>
          <TouchableOpacity
            style={[
              styles.zoomButton,
              {
                backgroundColor: "#F9FAFB",
                borderColor: "#D1D5DB",
              },
            ]}
            onPress={handleZoomOut}
          >
            <RNText style={{ color: "#2563EB", fontSize: 18, fontWeight: "bold" }}>−</RNText>
          </TouchableOpacity>
          <RNText style={[styles.zoomText, { color: "#111827" }]}>
            {zoomPercentage}
          </RNText>
          <TouchableOpacity
            style={[
              styles.zoomButton,
              {
                backgroundColor: "#F9FAFB",
                borderColor: "#D1D5DB",
              },
            ]}
            onPress={handleZoomIn}
          >
            <RNText style={{ color: "#2563EB", fontSize: 18, fontWeight: "bold" }}>+</RNText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.zoomButton,
              {
                backgroundColor: "#F9FAFB",
                borderColor: "#D1D5DB",
              },
            ]}
            onPress={handleResetZoom}
          >
            <RNText style={[styles.zoomResetText, { color: "#111827" }]}>
              1x
            </RNText>
          </TouchableOpacity>
        </View>
        <RNText style={[styles.quotationTitle, { color: "#111827" }]} numberOfLines={1}>
          {jobTitle}
        </RNText>
      </View>

      {/* Preview Container */}
      <View style={[styles.pdfContainer, { backgroundColor: "#F9FAFB", flex: 1 }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          scrollEnabled={isAuthenticated}
        >
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              width: '100%',
            }}
          >
            <div style={{ position: "relative", width: "100%", minHeight: 600 }}>
              <iframe
                ref={iframeRef}
                srcDoc={htmlContent}
                style={{
                  width: "100%",
                  height: 600,
                  border: "none",
                  borderRadius: 4,
                }}
                title="Job Post Preview"
              />

              {/* Blur + Login Prompt */}
              {!isAuthenticated && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(10px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: 24,
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        color: "#111827",
                        fontSize: 18,
                        fontWeight: "600",
                        marginBottom: 8,
                      }}
                    >
                      🔒 Login to View Preview
                    </p>
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#2563EB",
                        paddingHorizontal: 28,
                        paddingVertical: 14,
                        borderRadius: 10,
                        marginTop: 16,
                      }}
                      onPress={handleLoginRedirect}
                    >
                      <RNText
                        style={{
                          color: "#fff",
                          fontWeight: "600",
                          fontSize: 16,
                        }}
                      >
                        Login Now
                      </RNText>
                    </TouchableOpacity>
                  </div>
                </div>
              )}
            </div>
          </div>

          {isAuthenticated && isAdmin && (
            <View style={{ paddingTop: 20, paddingBottom: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor:
                    isAuthenticated && isAdmin && formData.is_draft
                      ? "#2563EB"
                      : "#ccc",
                  paddingVertical: 14,
                  paddingHorizontal: 15,
                  borderRadius: 10,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
                onPress={handlePostJob}
                disabled={!isAuthenticated || !isAdmin || !formData.is_draft}
              >
                <RNText
                  style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}
                >
                  {isAuthenticated && isAdmin && formData.is_draft
                    ? "✈️ Post Job"
                    : !formData.is_draft
                    ? "Job Posted"
                    : "Request to Post"}
                </RNText>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Bottom Action Bar */}
      <View
        style={[
          styles.bottomActions,
          {
            backgroundColor: "#FFFFFF",
            borderTopColor: "#E5E7EB",
          },
        ]}
      >
        <TouchableOpacity style={styles.actionButton} onPress={sharePdf}>
          <RNText style={{ fontSize: 22 }}>📄</RNText>
          <RNText
            style={[
              styles.actionButtonText,
              {
                color: isAuthenticated && isAdmin ? "#374151" : "#888",
              },
            ]}
          >
            Share PDF
          </RNText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={shareOnWhatsApp}>
          <RNText style={{ fontSize: 22 }}>💬</RNText>
          <RNText
            style={[
              styles.actionButtonText,
              {
                color: isAuthenticated && isAdmin ? "#374151" : "#888",
              },
            ]}
          >
            WhatsApp
          </RNText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleBack}>
          <RNText style={{ fontSize: 22 }}>❌</RNText>
          <RNText style={[styles.actionButtonText, { color: "#6B7280" }]}>
            Close
          </RNText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    paddingTop: 20,
    borderBottomWidth: 1,
    gap: 15,
  },
  zoomControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  zoomButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  zoomResetText: {
    fontSize: 12,
    fontWeight: "600",
  },
  zoomText: {
    fontSize: 13,
    fontWeight: "600",
    minWidth: 45,
    textAlign: "center",
  },
  quotationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  pdfContainer: {
    flex: 1,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    flexGrow: 1,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    paddingBottom: 20,
    gap: 5,
  },
  actionButton: {
    alignItems: "center",
    padding: 8,
    flex: 1,
  },
  actionButtonText: {
    fontSize: 11,
    marginTop: 4,
    fontWeight: "500",
  },
});
