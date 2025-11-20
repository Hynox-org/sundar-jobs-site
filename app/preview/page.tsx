'use client';

import generateHtmlTemplate from '../../components/HtmlTemplate';
import {
  HTML_TEMPLATES,
  HtmlTemplate,
} from '../../constants/jobTemplates';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { supabase } from '../../lib/supabase'; // Import supabase
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog'; // Using shadcn/ui AlertDialog
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import {
  ZoomIn, ZoomOut, RotateCcw, Paperclip, Share2, XCircle, Lock,
  AlertTriangle, BriefcaseBusiness // Corrected: Replaced Warning with AlertTriangle
} from 'lucide-react'; // Replaced Ionicons
import { Session } from '@supabase/supabase-js'; // Import Session type
// import { BlurView } from 'expo-blur'; // Replaced with CSS for web
// import { readAsStringAsync } from 'expo-file-system/legacy'; // Replaced with web file handling
// import *s Print from 'expo-print'; // Replaced with web printing
import { useSearchParams, useRouter } from 'next/navigation'; // Replaced useLocalSearchParams, useRouter
// import { shareAsync } from 'expo-sharing'; // Replaced with web sharing
import React, { useEffect, useRef, useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   Dimensions,
//   ScrollView,
//   Share,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native'; // Removed React Native imports
// import ViewShot from 'react-native-view-shot'; // Replaced with html2canvas for web
// import WebView from 'react-native-webview'; // Replaced with iframe for web

// For web-specific PDF generation and screenshot
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

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
  poster_url?: string; // New field to store the URL of the uploaded poster
}

export default function PreviewScreen() {
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const templateId = searchParams.get('templateId');
  const styleId = searchParams.get('styleId'); // Assuming styleId is also passed
  
  const [formData, setFormData] = useState<JobPostFormData | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<HtmlTemplate | null>(
    null
  );
  const [loading, setLoading] = useState(true); // For initial data loading
  const [isPostingJob, setIsPostingJob] = useState(false); // For job posting action
  const [zoom, setZoom] = useState(1);
  const [webViewKey, setWebViewKey] = useState(0); // This might not be needed for iframe/div
  const router = useRouter();
  const previewRef = useRef<HTMLDivElement>(null); // Ref for the div to capture

  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  // const screenWidth = Dimensions.get("window").width; // Replaced with dynamic width or CSS

  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // New state for authentication status

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setIsAuthenticated(!!session); // Set isAuthenticated based on session existence

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

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
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
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
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

        if (error) {
          throw error;
        }

        setFormData(data || null);
      } catch (e) {
        console.error("Error loading job post from Supabase:", e);
        toast.error("Failed to load job post."); // Corrected toast.error argument
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
    // Using AlertDialog for a more structured prompt on web
    return (
      <AlertDialog>
        <AlertDialogDescription>
          Please log in to view the full preview and request posting.
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => toast.info("Login cancelled.")}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => router.push("/login")}>Login</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    );
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

  const sharePdf = async () => {
    if (!previewRef.current || !formData || !selectedTemplate) {
      toast.error("Job post content not ready for PDF generation.");
      return;
    }

    try {
      const canvas = await html2canvas(previewRef.current, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`job-post-${formData.job_title}.pdf`);
      toast.success("PDF generated and downloaded!");
    } catch (error: any) {
      toast.error(`Error generating PDF: ${error.message}`);
      console.error(error);
    }
  };

  const shareOnWhatsApp = async () => {
    if (!formData) {
      toast.error("Job data not available.");
      return;
    }
    try {
      const jobDetails = `
🌟 *New Job Opportunity!* 🌟

*Job Title:* ${formData.job_title}
*Category:* ${formData.category}
*Description:* ${formData.title || "N/A"}
*Job Type:* ${formData.job_type || "N/A"}
*Vacancy:* ${formData.vacancy || "N/A"}
*Experience:* ${formData.experience || "N/A"}
*Salary:* ${formData.salary || "N/A"}
*Job Description:* ${formData.job_description || "N/A"}
*Company Name:* ${formData.company_name || "N/A"}
*Company Address:* ${formData.company_address || "N/A"}
*Company Email:* ${formData.company_email || "N/A"}
*Company Phone:* ${formData.company_phone || "N/A"}
*Application Deadline:* ${formData.application_deadline || "N/A"}
*Additional Info:* ${formData.additional_info || "N/A"}

💼 *View more details:* ${
        formData.poster_url ||
        `https://sundarjobs.com/posts/preview?jobId=${formData.id}&templateId=${
          formData.template_id || ""
        }`
      }

🚀 *Find more jobs like this on SundarJobs!*
      `;
      if (navigator.share) {
        await navigator.share({
          title: `Job Opportunity: ${formData.job_title}`,
          text: jobDetails,
          url: formData.poster_url || `https://sundarjobs.com/posts/preview?jobId=${formData.id}&templateId=${formData.template_id || ''}`,
        });
      } else {
        window.open(`whatsapp://send?text=${encodeURIComponent(jobDetails)}`, '_blank');
        toast.info("Opened WhatsApp for sharing.");
      }
    } catch (error: any) {
      toast.error(`Share Error: ${error.message}`);
      console.error(error);
    }
  };

  const handlePostJob = async () => {
    if (!formData || !selectedTemplate || !session) {
      toast.error("Job post data or session is missing.");
      return;
    }

    setIsPostingJob(true);
    try {
      // Generate HTML content for upload (using the template)
      const htmlContent = generateHtmlTemplate({
        formData: formData,
        template: selectedTemplate,
      });

      // For web, we need to convert the HTML to a Blob or File to upload.
      // Assuming the backend expects an image or PDF, generating PDF from HTML for upload.
      const canvas = await html2canvas(previewRef.current!, { scale: 2 });
      const imgData = canvas.toDataURL('image/png'); // Can also create a Blob
      
      // Convert data URL to Blob
      const byteString = atob(imgData.split(',')[1]);
      const mimeString = imgData.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      const fileName = `poster-${formData.id}-${Date.now()}.png`; // Changed to png for image upload
      const filePath = `posters/${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from("sundarjobs")
        .upload(filePath, blob, {
          contentType: 'image/png', // Changed content type
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

      toast.success("Job poster uploaded and job posted successfully!"); // Using toast
      router.push("/"); // Redirect to home page
    } catch (error: any) {
      toast.error(`Post Job Error: ${error.message}`); // Using toast
      console.error("Post Job Error:", error);
    } finally {
      setIsPostingJob(false);
    }
  };

  const handleBack = () => {
    router.back(); // Next.js router.back()
  };

  if (loading) {
    // Only check for initial loading
    return (
      <div
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: colors.background,
        }}
      >
        <Spinner size="large" color={colors.tint} />
        <p style={{ marginTop: 15, fontSize: '16px', fontWeight: '500', color: colors.secondaryText }}>
          Preparing job post preview...
        </p>
      </div>
    );
  }

  if (!formData || !selectedTemplate) {
    return (
      <div
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: colors.background,
        }}
      >
        <AlertTriangle width={48} height={48} color={colors.secondaryText} style={{ marginBottom: 10 }} />
        <p style={{ fontSize: '16px', fontWeight: '500', textAlign: 'center', color: colors.text }}>
          Could not load job post preview.
        </p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <span style={{ color: colors.tint, fontWeight: "600" }}>Go Back</span>
        </Button>
      </div>
    );
  }

  const htmlContent =
    formData && selectedTemplate
      ? generateHtmlTemplate({
          formData: formData,
          template: selectedTemplate,
        })
      : "<h1>Loading...</h1>";

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: colors.background }}>
      {isPostingJob && (
        <div
          style={{
            position: 'fixed', // Use fixed for full screen overlay
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)', // Mimic blur with translucent background
            backdropFilter: 'blur(10px)', // CSS blur effect
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <Spinner size="large" color={colors.tint} />
            <p style={{ marginTop: 15, fontSize: '16px', fontWeight: '500', color: colors.secondaryText }}>
              Posting job...
            </p>
          </div>
        </div>
      )}

      {/* Top Control Bar */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingLeft: 15,
          paddingRight: 15,
          paddingTop: 50,
          paddingBottom: 12,
          borderBottomWidth: 1,
          gap: 15,
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.border,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}> {/* zoomControls */}
          <Button
            variant="outline"
            onClick={handleZoomOut}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              borderWidth: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <ZoomOut width={20} height={20} color={colors.tint} />
          </Button>
          <p style={{ fontSize: '13px', fontWeight: '600', minWidth: '45px', textAlign: 'center', color: colors.text }}>
            {Math.round(zoom * 100)}%
          </p>
          <Button
            variant="outline"
            onClick={handleZoomIn}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              borderWidth: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <ZoomIn width={20} height={20} color={colors.tint} />
          </Button>
          <Button
            variant="outline"
            onClick={handleResetZoom}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              borderWidth: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: colors.background,
              borderColor: colors.border,
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '600', color: colors.text }}>
              1x
            </span>
          </Button>
        </div>
        <p style={{ fontSize: '16px', fontWeight: 'bold', flex: 1, textAlign: 'right', color: colors.text }}>
          {formData.job_title}
        </p>
      </div>

      {/* Preview Content Area */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden', // pdfContainer
        }}
      >
        <div
          ref={previewRef} // Attach ref for html2canvas
          style={{
            alignItems: "center", // scrollContent, align-items: center
            paddingTop: 15,
            paddingBottom: 15,
            paddingLeft: 15,
            paddingRight: 15,
            flexGrow: 1,
            backgroundColor: colors.background, // pdfContainer background
            overflowY: isAuthenticated ? 'auto' : 'hidden', // scrollEnabled for ScrollView
          }}
          className="h-full w-full"
        >
          <div style={{
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 4,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            maxWidth: '600px', // A reasonable max-width for document preview
          }}>
            {htmlContent ? (
              <>
                <div // Replaces WebView
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                  style={{
                    width: '100%',
                    height: 'auto', // Adjust height based on content
                    minHeight: '600px', // Minimum height for the preview
                    padding: 20,
                  }}
                />

                {/* Blur + Login Overlay */}
                {!isAuthenticated && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundColor: isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: 24,
                    }}
                  >
                      <Lock width={56} height={56} color={colors.secondaryText} style={{ marginBottom: 16 }} />
                      <p
                        style={{
                          color: colors.text,
                          fontSize: '18px',
                          fontWeight: '600',
                          textAlign: 'center',
                          marginBottom: 8,
                        }}
                      >
                        Login to View Preview
                      </p>
                      <Button
                        onClick={() => router.push("/login")}
                        style={{
                          backgroundColor: colors.tint,
                          paddingLeft: 28,
                          paddingRight: 28,
                          paddingTop: 14,
                          paddingBottom: 14,
                          borderRadius: 10,
                        }}
                      >
                        <span style={{ color: "#fff", fontWeight: "600", fontSize: '16px' }}>
                          Login Now
                        </span>
                      </Button>
                  </div>
                )}
              </>
            ) : null}
          </div>

          {isAuthenticated && isAdmin && (
            <>
              {/* Post Job Button - BELOW Preview */}
              <div style={{ paddingTop: 20, paddingBottom: 10, width: '100%', maxWidth: '600px' }}>
                <Button
                  style={{
                    backgroundColor:
                      isAuthenticated && isAdmin && formData.is_draft
                        ? colors.tint
                        : "#ccc", // Only enable if authenticated AND admin
                    paddingTop: 14,
                    paddingBottom: 14,
                    paddingLeft: 15,
                    paddingRight: 15,
                    borderRadius: 10,
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "center",
                    gap: 8,
                    width: '100%',
                  }}
                  onClick={handlePostJob} // Call handlePostJob
                  disabled={!isAuthenticated || !isAdmin || !formData.is_draft} // Disable if not authenticated, not admin, or already posted
                >
                  <Paperclip width={20} height={20} color="#fff" />
                  <span style={{ color: "#fff", fontWeight: "600", fontSize: '16px' }}>
                    {isAuthenticated && isAdmin && formData.is_draft
                      ? "Post Job"
                      : !formData.is_draft
                      ? "Job Posted"
                      : "Request to Post"}
                  </span>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Bottom Action Bar (No Request to Post) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
          paddingTop: 12,
          paddingBottom: 30,
          borderTopWidth: 1,
          gap: 5,
          backgroundColor: colors.cardBackground,
          borderTopColor: colors.border,
        }}
      >
        <Button
          variant="ghost"
          onClick={sharePdf}
          disabled={formData.is_draft}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 8, flex: 1 }}
        >
          <Paperclip
            width={22} height={22}
            color={
              isAuthenticated && isAdmin && !formData.is_draft
                ? colors.tint
                : colors.secondaryText
            }
          />
          <p
            style={{
              fontSize: '11px',
              marginTop: 4,
              fontWeight: '500',
              color:
                isAuthenticated && isAdmin && !formData.is_draft ? colors.secondaryText : '#888',
            }}
          >
            Share PDF
          </p>
        </Button>

        <Button
          variant="ghost"
          onClick={shareOnWhatsApp}
          disabled={formData.is_draft}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 8, flex: 1 }}
        >
          <Share2
            width={22} height={22}
            color={
              isAuthenticated && isAdmin && !formData.is_draft
                ? colors.tint
                : colors.secondaryText
            }
          />
          <p
            style={{
              fontSize: '11px',
              marginTop: 4,
              fontWeight: '500',
              color:
                isAuthenticated && isAdmin && !formData.is_draft ? colors.secondaryText : '#888',
            }}
          >
            WhatsApp
          </p>
        </Button>

        <Button variant="ghost" onClick={handleBack} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 8, flex: 1 }}>
          <XCircle
            width={22} height={22}
            color={colors.secondaryText}
          />
          <p style={{ fontSize: '11px', marginTop: 4, fontWeight: '500', color: colors.secondaryText }}>
            Close
          </p>
        </Button>
      </div>
    </div>
  );
}
