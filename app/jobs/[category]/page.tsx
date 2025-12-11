'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import generateHtmlTemplate from "@/components/HtmlTemplate";
import { AdditionalJob, HTML_TEMPLATES } from '@/constants/jobTemplates';
import Header from '@/components/layout/header'; // Import your Header component

interface JobPostFormData {
  id: string;
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
  poster_url: string;
  template_id: string;
  template_style: string;
  additional_jobs: AdditionalJob[];
  created_at: string;
  is_draft: boolean;
}

const ITEMS_PER_PAGE = 5;

export default function CategoryJobsScreen() {
  const router = useRouter();
  const params = useParams();
  const category = params?.category as string;
  
  const [jobs, setJobs] = useState<JobPostFormData[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        setIsAdmin(profile?.role === 'admin');
      }
    };

    checkAdmin();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          setIsAdmin(profile?.role === 'admin');
        } else {
          setIsAdmin(false);
        }
      }
    );

    return () => authListener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchJobsByCategory();
  }, [category, currentPage, isAdmin]);

  const fetchJobsByCategory = async () => {
    if (!category) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const isAllCategory = category === 'all';

      let query = supabase
        .from('jobs')
        .select(
          'id, title, job_title, vacancy, job_type, category, experience, salary, job_description, company_name, company_address, company_email, company_phone, application_deadline, additional_info, poster_url, template_id, template_style, additional_jobs, created_at, is_draft',
          { count: 'exact' }
        );

      if (!isAllCategory) {
        query = query.eq('category', category);
      }

      if (!isAdmin) {
        query = query.eq('is_draft', false);
      }

      const { count, error: countError } = await query.range(0, 0);
      if (countError) throw countError;
      setTotalJobs(count || 0);

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      setJobs(data || []);
    } catch (e: any) {
      console.error('Error fetching jobs by category:', e);
      alert(`Failed to load jobs for ${category}: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setCurrentPage(1);
    await fetchJobsByCategory();
    setRefreshing(false);
  };

  const totalPages = Math.ceil(totalJobs / ITEMS_PER_PAGE);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePageSelect = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = (item: JobPostFormData) => {
    const viewDetailsUrl =
      item.poster_url ||
      `https://sundarjobs.com/posts/preview?jobId=${item.id}&templateId=${
        item.template_id || ''
      }&templateStyle=${item.template_style || ''}`;

    let fullShareMessage = '';

    fullShareMessage += `${item.job_title} - ${item.vacancy} No`;
    if (item.experience) {
      fullShareMessage += `\n(${item.experience} Experience)`;
    }
    fullShareMessage += '\n';

    if (item.additional_jobs && item.additional_jobs.length > 0) {
      item.additional_jobs.forEach((adj) => {
        fullShareMessage += `\n${adj.job_title} - ${adj.vacancy} No`;
        if (adj.experience) {
          fullShareMessage += `\n(${adj.experience} Experience)`;
        }
      });
      fullShareMessage += '\n';
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

    // Web share or WhatsApp
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullShareMessage)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading && !refreshing) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#EDF2F4',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4" />
            <p style={{ color: '#6B7280', fontSize: 14, fontWeight: '600' }}>Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (totalJobs === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 32,
          backgroundColor: 'white',
        }}>
          <div style={{
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: '#EDF2F4',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
          }}>
            <span style={{ fontSize: 48 }}>💼</span>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
            No Jobs Available
          </h2>
          <p style={{ fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 1.5, marginBottom: 32 }}>
            There are currently no positions available in {category}.
          </p>
          <button
            onClick={() => router.back()}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: '#EF233C',
              color: 'white',
              padding: '12px 24px',
              borderRadius: 8,
              border: 'none',
              fontSize: 15,
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            <span>←</span>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderPagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div style={{ paddingTop: 24, paddingBottom: 16, textAlign: 'center' }}>
        <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, fontWeight: '500' }}>
          Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, totalJobs)} of {totalJobs} jobs
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: currentPage === 1 ? '#D1D5DB' : '#EF233C',
              color: 'white',
              border: 'none',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ←
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => handlePageSelect(1)}
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: currentPage === 1 ? '#EF233C' : 'white',
                  color: currentPage === 1 ? 'white' : '#4B5563',
                  border: '1px solid #D1D5DB',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: '600',
                  padding: '0 8px',
                }}
              >
                1
              </button>
              {startPage > 2 && <span style={{ color: '#9CA3AF', fontWeight: '600' }}>...</span>}
            </>
          )}

          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => handlePageSelect(page)}
              style={{
                minWidth: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: currentPage === page ? '#EF233C' : 'white',
                color: currentPage === page ? 'white' : '#4B5563',
                border: '1px solid #D1D5DB',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: '600',
                padding: '0 8px',
              }}
            >
              {page}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span style={{ color: '#9CA3AF', fontWeight: '600' }}>...</span>}
              <button
                onClick={() => handlePageSelect(totalPages)}
                style={{
                  minWidth: 36,
                  height: 36,
                  borderRadius: 8,
                  backgroundColor: currentPage === totalPages ? '#EF233C' : 'white',
                  color: currentPage === totalPages ? 'white' : '#4B5563',
                  border: '1px solid #D1D5DB',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: '600',
                  padding: '0 8px',
                }}
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: currentPage === totalPages ? '#D1D5DB' : '#EF233C',
              color: 'white',
              border: 'none',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#EDF2F4' }}>
      <Header />
      
      <div style={{ padding: 16, paddingBottom: 32, maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {jobs.map((item, index) => {
          const globalIndex = (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
          const showDraftBadge = isAdmin && item.is_draft;
          const selectedTemplate = HTML_TEMPLATES.find((t) => t.id === item.template_id);

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                marginBottom: 20,
                overflow: 'hidden',
                boxShadow: '0 3px 10px rgba(0, 0, 0, 0.08)',
                position: 'relative',
              }}
            >
              {/* Job Number Badge */}
              <div style={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: '#EF233C',
                padding: '6px 12px',
                borderRadius: 20,
                zIndex: 10,
              }}>
                <span style={{ fontSize: 12, fontWeight: '700', color: 'white', letterSpacing: 0.5 }}>
                  #{String(globalIndex).padStart(2, '0')}
                </span>
              </div>

              {/* Draft Badge */}
              {showDraftBadge && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  backgroundColor: '#FBB13C',
                  padding: '6px 12px',
                  borderRadius: 20,
                  zIndex: 10,
                }}>
                  <span style={{ fontSize: 12, fontWeight: '700', color: 'white', letterSpacing: 0.5 }}>
                    DRAFT
                  </span>
                </div>
              )}

              {/* Category Badge */}
              <div style={{ padding: 16, paddingBottom: 12 }}>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#8D80AD',
                  padding: '6px 12px',
                  borderRadius: 6,
                }}>
                  <span style={{ fontSize: 11, fontWeight: '700', color: 'white', letterSpacing: 0.5 }}>
                    {item.category.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Iframe Preview */}
              {item.template_id && selectedTemplate && (
                <div style={{
                  margin: '0 16px 16px',
                  borderRadius: 10,
                  overflow: 'hidden',
                  border: '2px solid #EF233C',
                  backgroundColor: '#F9FAFB',
                }}>
                  <iframe
                    srcDoc={generateHtmlTemplate({
                      formData: item,
                      template: selectedTemplate,
                    })}
                    style={{
                      width: '100%',
                      height: 450,
                      border: 'none',
                    }}
                    title={`Job ${item.id}`}
                  />
                </div>
              )}

              {/* Buttons */}
              <div style={{
                display: 'flex',
                gap: 10,
                margin: '0 16px 16px',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={() => handleShare(item)}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    backgroundColor: '#25D366',
                    color: 'white',
                    padding: '14px',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: 15,
                    fontWeight: '600',
                    cursor: 'pointer',
                    minWidth: 200,
                  }}
                >
                  <span style={{ fontSize: 20 }}>💬</span>
                  Share on WhatsApp
                </button>

                {isAdmin && item.is_draft && (
                  <button
                    onClick={() => {
                      router.push(
                        `/postjob${item.is_draft ? '' : '/preview'}?jobId=${item.id}&templateId=${item.template_id || 'default-template'}`
                      );
                    }}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 10,
                      backgroundColor: '#2563EB',
                      color: 'white',
                      padding: '14px',
                      borderRadius: 8,
                      border: 'none',
                      fontSize: 15,
                      fontWeight: '600',
                      cursor: 'pointer',
                      minWidth: 150,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>👁️</span>
                    View
                  </button>
                )}
              </div>

              {/* Bottom Accent */}
              <div style={{ height: 4, width: '100%', backgroundColor: '#FBB13C' }} />
            </div>
          );
        })}

        {totalPages > 1 && renderPagination()}
      </div>
    </div>
  );
}
