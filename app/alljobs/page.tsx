'use client';

import { Colors } from '../../constants/theme';
import { useThemeColor } from '../../hooks/use-theme-color';
import { supabase } from '../../lib/supabase';
import { Search, XCircle, BriefcaseBusiness, Eye, Share2, Tag, Timer, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Spinner } from '../../components/ui/spinner';
import { toast } from 'sonner';

interface Job {
  id: string;
  title: string;
  job_title: string;
  vacancy: number;
  job_type?: string;
  category: string;
  experience: string;
  salary?: string;
  job_description: string;
  company_name?: string;
  company_address?: string;
  company_email: string;
  company_phone?: string;
  application_deadline?: string;
  additional_info?: string;
  poster_url?: string;
  is_draft?: boolean;
  user_id?: string;
  template_id?: string;
  template_style?: string;
}

export default function AllJobsScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const colors = Colors.light;
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();

        let query = supabase
          .from('jobs')
          .select('id, title, job_title, vacancy, job_type, category, experience, salary, job_description, company_name, company_address, company_email, company_phone, application_deadline, additional_info, poster_url, is_draft, user_id, template_id, template_style');
        if (user) {
          query = query.or(`is_draft.eq.false,user_id.eq.${user.id}`);
        } else {
          query = query.eq('is_draft', false);
        }
        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) throw error;
        setJobs(data || []);
        setFilteredJobs(data || []);
      } catch (error: any) {
        console.error('Failed to fetch jobs:', error.message);
        toast.error('Error: Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredJobs(jobs);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = jobs.filter(job =>
        job.job_title.toLowerCase().includes(lowercasedQuery) ||
        (job.title && job.title.toLowerCase().includes(lowercasedQuery)) ||
        (job.company_name && job.company_name.toLowerCase().includes(lowercasedQuery))
      );
      setFilteredJobs(filtered);
    }
  }, [searchQuery, jobs]);

  const handleShare = async (item: Job) => {
    const jobDetails = `
🌟 *New Job Opportunity!* 🌟

*Job Title:* ${item.job_title}
*Category:* ${item.category}
*Description:* ${item.title || 'N/A'}
*Job Type:* ${item.job_type || 'N/A'}
*Vacancy:* ${item.vacancy || 'N/A'}
*Experience:* ${item.experience || 'N/A'}
*Salary:* ${item.salary || 'N/A'}
*Job Description:* ${item.job_description || 'N/A'}
*Company Name:* ${item.company_name || 'N/A'}
*Company Address:* ${item.company_address || 'N/A'}
*Company Email:* ${item.company_email || 'N/A'}
*Company Phone:* ${item.company_phone || 'N/A'}
*Application Deadline:* ${item.application_deadline || 'N/A'}
*Additional Info:* ${item.additional_info || 'N/A'}

💼 *View more details:* ${item.poster_url || `https://sundarjobs.com/posts/preview?jobId=${item.id}&templateId=${item.template_id || ''}&styleId=${item.template_style || ''}`}

🚀 *Find more jobs like this on SundarJobs!*`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Job Opportunity: ${item.job_title}`,
          text: jobDetails,
          url: item.poster_url || `https://sundarjobs.com/posts/preview?jobId=${item.id}&templateId=${item.template_id || ''}&styleId=${item.template_style || ''}`,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast.error('Failed to share job post.');
      }
    } else {
      prompt('Share this job opportunity:', jobDetails);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
        <Spinner width={32} height={32} color={colors.tint} />
        <p className="mt-3 text-sm font-semibold" style={{ color: colors.secondaryText }}>
          Loading jobs...
        </p>
      </div>
    );
  }

  if (filteredJobs.length === 0 && !loading) {
    return (
      <div style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 16, paddingTop: 12, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>
          <Search width={18} height={18} color="#9CA3AF" style={{ marginRight: 8 }} />
          <Input
            className="flex-1 text-base text-[#111827]"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery !== '' && (
            <Button variant="ghost" onClick={() => setSearchQuery('')}>
              <XCircle width={18} height={18} color="#9CA3AF" />
            </Button>
          )}
        </div>
        <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <BriefcaseBusiness width={48} height={48} color={colors.tint} />
          <h1 style={{ fontSize: '18px', fontWeight: '700', marginTop: 16, marginBottom: 8, color: colors.text }}>No Jobs Found</h1>
          <p style={{ fontSize: '14px', textAlign: 'center', color: colors.secondaryText }}>
            {searchQuery ? 'Try adjusting your search' : 'Start posting job opportunities'}
          </p>
        </div>
      </div>
    );
  }

  const renderItem = ({ item }: { item: Job }) => (
    <div
      key={item.id}
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 12,
        paddingBottom: 12,
        backgroundColor: item.is_draft ? '#FFFBEB' : '#FFFFFF',
        borderLeftWidth: item.is_draft ? 4 : 0,
        borderLeftColor: item.is_draft ? '#FCD34D' : 'transparent',
      }}
    >
      <div style={{ flex: 1, marginRight: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
          <p style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: 2, flex: 1 }} className="truncate">
            {item.job_title}
          </p>
          {item.is_draft && (
            <div style={{ backgroundColor: '#FEE2E2', paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, borderRadius: 4, marginLeft: 8 }}>
              <p style={{ color: '#EF4444', fontSize: '11px', fontWeight: '600' }}>Draft</p>
            </div>
          )}
        </div>
        {item.company_name && (
          <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: 4 }} className="truncate">
            {item.company_name}
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4 }}>
          {item.job_type && (
            <p style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              <BriefcaseBusiness width={12} height={12} color="#6B7280" /> {item.job_type}
            </p>
          )}
          {item.category && (
            <p style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Tag width={12} height={12} color="#6B7280" /> {item.category}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 4 }}>
          {item.experience && (
            <p style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Timer width={12} height={12} color="#6B7280" /> {item.experience}
            </p>
          )}
          {item.salary && (
            <p style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Wallet width={12} height={12} color="#6B7280" /> {item.salary}
            </p>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: 8 }}>
        <Button
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 6,
            gap: 4,
            backgroundColor: colors.tint,
            color: 'white'
          }}
          onClick={() => {
            // Always navigate to the template selection page
            router.push(`/posts/templates?jobId=${item.id}`);
          }}
>
          <Eye width={16} height={16} color="white" />
  <p      style={{ fontSize: '13px', fontWeight: '600', color: '#FFFFFF' }}>View</p>
        </Button>
        <Button
          onClick={() => handleShare(item)}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 12,
            paddingRight: 12,
            paddingTop: 8,
            paddingBottom: 8,
            borderRadius: 6,
            gap: 4,
            backgroundColor: '#F0FDF4',
            borderWidth: 1,
            borderColor: '#BBF7D0',
            color: '#25D366',
          }}
        >
          <Share2 width={16} height={16} color="#25D366" />
          <p style={{ fontSize: '13px', fontWeight: '600', color: '#25D366' }}>Share</p>
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex-1 bg-gray-100">
      <div className="bg-white p-4 border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center">
          <Search width={18} height={18} color="#9CA3AF" className="mr-2" />
          <Input
            className="flex-1 text-base text-gray-900"
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery !== '' && (
            <Button variant="ghost" onClick={() => setSearchQuery('')} className="ml-2">
              <XCircle width={18} height={18} color="#9CA3AF" />
            </Button>
          )}
        </div>
      </div>
      <div className="max-w-4xl mx-auto bg-white pb-5">
        {filteredJobs.map((item) => (
          <React.Fragment key={item.id}>
            {renderItem({ item })}
            <div className="h-px bg-gray-200 ml-4" />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
