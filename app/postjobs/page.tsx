'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SelectionModal from '../../components/ui/SelectionModal';
import { JOB_CATEGORIES } from '../../constants/jobCategories';
import { supabase } from '../../lib/supabase';
import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useWindowWidth } from '@react-hook/window-size';

interface AdditionalJob {
  job_title: string;
  vacancy: number;
  experience: string;
}

interface FormData {
  title: string;
  jobTitle: string;
  vacancy: string;
  category: string;
  experience: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  additional_jobs?: AdditionalJob[];
}

export default function PostJobsScreen() {
  const router = useRouter();
  const width = useWindowWidth();
  const isSmallScreen = width < 768;
  const isMediumScreen = width >= 768 && width < 1024;

  const [form, setForm] = useState<FormData>({
    title: "",
    jobTitle: "",
    vacancy: "",
    category: "",
    experience: "",
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    additional_jobs: [],
  });
  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});
  const [user, setUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
      } else {
        setUser(user);
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, [router]);

  if (loadingUser) return null;

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: false }));
  };

  const handleAdditionalJobChange = (
    index: number,
    field: keyof AdditionalJob,
    value: string | number
  ) => {
    if (!form.additional_jobs) return;
    const updatedJobs = [...form.additional_jobs];
    if (field === "vacancy") {
      updatedJobs[index][field] = typeof value === "string" ? Number(value) : value;
    } else {
      updatedJobs[index][field] = value as string;
    }
    setForm({ ...form, additional_jobs: updatedJobs });
  };

  const handleRemoveAdditionalJob = (index: number) => {
    setForm((prev) => ({
      ...prev,
      additional_jobs: prev.additional_jobs?.filter((_, i) => i !== index)
    }));
  };

  const handleAddAdditionalJob = () => {
    if ((form.additional_jobs?.length ?? 0) >= 6) return;
    setForm((prev) => ({
      ...prev,
      additional_jobs: [...(prev.additional_jobs ?? []), { job_title: "", vacancy: 0, experience: "" }]
    }));
  };

const handleSaveJob = async (action: "draft" | "template") => {
  // Required fields validation
  const required: (keyof FormData)[] = [
    "title",
    "jobTitle",
    "vacancy",
    "category",
    "experience",
    "companyName"
  ];
  const newErrors: Partial<Record<keyof FormData, boolean>> = {};
  const missing = required.filter((key) => {
    if (!form[key]) {
      newErrors[key] = true;
      return true;
    }
    return false;
  });
  if (missing.length > 0) {
    setErrors(newErrors);
    toast.error(`Please fill in all required fields: ${missing.join(", ")}`);
    return;
  }

  if (!user) {
    toast.error("You must be logged in to post a job.");
    router.push("/login");
    return;
  }

  try {
    const jobData = {
      title: form.title,
      job_title: form.jobTitle,
      vacancy: parseInt(form.vacancy, 10),
      category: form.category,
      experience: form.experience,
      company_name: form.companyName,
      company_address: form.companyAddress,
      company_email: form.companyEmail,
      company_phone: form.companyPhone,
      additional_jobs: form.additional_jobs || [],
      user_id: user.id,
      is_draft: action === "draft",
      template_id: null,       // Always initialize as null, to be set after template selection
      poster_url: null         // Always initialize as null
    };
    const { data, error } = await supabase.from('jobs').insert([jobData]).select();
    if (error || !data?.length) {
      toast.error("Could not create job post.");
      return;
    }
    const newJobId = data[0].id;
    if (action === "draft") {
      toast.success("Job saved as draft!");
      router.push("/alljobs");
    } else if (action === "template") {
      toast.success("Proceeding to template selection!");
      router.push(`/posts/templates?jobId=${newJobId}`);
    }
  } catch (e) {
    console.error("Error saving job post to Supabase:", e);
    toast.error("Error saving job post.");
  }
};

  const containerPadding = isSmallScreen ? 16 : isMediumScreen ? 40 : 80;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      backgroundColor: '#F9FAFB',
    }}>
      <div style={{
        paddingTop: 24,
        paddingBottom: 24,
        paddingLeft: containerPadding,
        paddingRight: containerPadding,
        backgroundColor: '#F9FAFB',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#111827',
            marginBottom: 8
          }}>Post a New Job</h1>
          <p style={{
            fontSize: '15px',
            color: '#6B7280',
            textAlign: 'center'
          }}>Fill out the form below to post a job application.</p>
        </div>
        {/* Main Form */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: '#E5E7EB'
          }}>Job Information</p>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="posterTitle" style={{
              fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block'
            }}>Poster Title <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span></label>
            <Input id="posterTitle" placeholder="e.g., Mega Hiring Drive 2025"
              className={errors.title ? 'border-red-500 ring-2 ring-red-500' : ''}
              value={form.title}
              onChange={e => handleChange("title", e.target.value)}
            />
          </div>
          {/* Job Title & Vacancy */}
          <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 16 }}>
            <div style={{ marginBottom: 16, flex: 1 }}>
              <label htmlFor="jobPosition" style={{
                fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block'
              }}>Job Position <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span></label>
              <Input
                id="jobPosition"
                placeholder="e.g., Software Engineer"
                className={errors.jobTitle ? 'border-red-500 ring-2 ring-red-500' : ''}
                value={form.jobTitle}
                onChange={e => handleChange("jobTitle", e.target.value)}
              />
            </div>
            <div style={{ marginBottom: 16, flex: 1 }}>
              <label htmlFor="vacancy" style={{
                fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block'
              }}>Number of Vacancies <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span></label>
              <Input id="vacancy" placeholder="e.g., 5" type="number"
                className={errors.vacancy ? 'border-red-500 ring-2 ring-red-500' : ''}
                value={form.vacancy}
                onChange={e => handleChange("vacancy", e.target.value)}
              />
            </div>
          </div>
          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="category" style={{
              fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block'
            }}>Category <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span></label>
            <Button
              id="category"
              variant="outline"
              className={`w-full justify-between border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base min-h-[48px] ${errors.category ? 'border-red-500 ring-2 ring-red-500' : ''}`}
              onClick={() => setCategoryModalVisible(true)}
            >
              <span className={form.category ? 'text-[#111827]' : 'text-[#9CA3AF]'}>
                {form.category || "Select a category"}
              </span>
              <Search size={16} className="h-4 w-4 opacity-50" />
            </Button>
          </div>
          {/* Experience */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="experience" style={{
              fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block'
            }}>Experience Required <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span></label>
            <Input
              id="experience"
              placeholder="e.g., Fresher or 2-5 years"
              className={errors.experience ? 'border-red-500 ring-2 ring-red-500' : ''}
              value={form.experience}
              onChange={e => handleChange("experience", e.target.value)}
            />
          </div>
          {/* Additional Jobs */}
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: 12 }}>Additional Job Positions</p>
            {form.additional_jobs?.map((job, idx) => (
              <div key={idx} style={{
                marginBottom: 16,
                borderWidth: 1,
                borderColor: '#e0e0e0',
                padding: 12,
                borderRadius: 8
              }}>
                <Input placeholder="Job Title" className="mb-3"
                  value={job.job_title}
                  onChange={e => handleAdditionalJobChange(idx, "job_title", e.target.value)} />
                <Input placeholder="Vacancy" className="mb-3" type="number"
                  value={job.vacancy.toString()}
                  onChange={e => handleAdditionalJobChange(idx, "vacancy", e.target.value)} />
                <Input placeholder="Experience" className="mb-3"
                  value={job.experience}
                  onChange={e => handleAdditionalJobChange(idx, "experience", e.target.value)} />
                <Button
                  style={{ backgroundColor: "#EF4444" }}
                  onClick={() => handleRemoveAdditionalJob(idx)}
                >
                  <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>Remove</span>
                </Button>
              </div>
            ))}
            {(form.additional_jobs?.length ?? 0) < 5 && (
              <Button style={{ backgroundColor: "#2563EB" }} onClick={handleAddAdditionalJob}>
                <span style={{ color: '#fff', fontWeight: '700', fontSize: '16px' }}>Add Another Job Position</span>
              </Button>
            )}
          </div>
          {/* Company Section */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{
              fontSize: '18px', fontWeight: '600', color: '#111827',
              marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB'
            }}>Company Information</p>
            <div style={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row',
              gap: 16
            }}>
              <div style={{ marginBottom: 16, flex: 1 }}>
                <label htmlFor="companyName" style={{
                  fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block'
                }}>Company Name <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span></label>
                <Input
                  id="companyName"
                  placeholder="e.g., TCS"
                  className={errors.companyName ? 'border-red-500 ring-2 ring-red-500' : ''}
                  value={form.companyName}
                  onChange={e => handleChange("companyName", e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 16, flex: 1 }}>
                <label htmlFor="companyAddress" style={{
                  fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block'
                }}>Company Location</label>
                <Input
                  id="companyAddress"
                  placeholder="e.g., Coimbatore, Tamil Nadu"
                  value={form.companyAddress}
                  onChange={e => handleChange("companyAddress", e.target.value)}
                />
              </div>
            </div>
            <div style={{
              display: 'flex',
              flexDirection: isSmallScreen ? 'column' : 'row', gap: 16
            }}>
              <div style={{ marginBottom: 16, flex: 1 }}>
                <label htmlFor="companyEmail" style={{
                  fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block'
                }}>Company Email</label>
                <Input
                  id="companyEmail"
                  placeholder="e.g., careers@company.com"
                  type="email"
                  value={form.companyEmail}
                  onChange={e => handleChange("companyEmail", e.target.value)}
                />
              </div>
              <div style={{ marginBottom: 16, flex: 1 }}>
                <label htmlFor="companyPhone" style={{
                  fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block'
                }}>Company Phone</label>
                <Input
                  id="companyPhone"
                  placeholder="e.g., +91 98765 43210"
                  type="tel"
                  value={form.companyPhone}
                  onChange={e => handleChange("companyPhone", e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: isSmallScreen ? 'column' : 'row',
            gap: 16,
            marginTop: 20,
            justifyContent: 'space-between'
          }}>
            <Button
              className="flex-1 p-6"
              style={{ backgroundColor: "#6B7280" }}
              onClick={() => handleSaveJob("draft")}
            >
              <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '16px' }}>
                Save as Draft
              </span>
            </Button>
            <Button
              className="flex-1 p-6"
              style={{ backgroundColor: "#2563EB" }}
              onClick={() => handleSaveJob("template")}
            >
              <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '16px' }}>
                Proceed with Templates
              </span>
            </Button>
          </div>
          <div style={{ height: 40 }} />
        </div>
        <SelectionModal
          isVisible={isCategoryModalVisible}
          data={JOB_CATEGORIES}
          onSelect={value => {
            handleChange("category", value);
            setCategoryModalVisible(false);
          }}
          onClose={() => setCategoryModalVisible(false)}
          title="Select Job Category"
          selectedValue={form.category}
        />
      </div>
    </div>
  );
}
