'use client';

import SelectionModal from '../../components/ui/SelectionModal';
import { JOB_CATEGORIES } from '../../constants/jobCategories';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { supabase } from '../../lib/supabase';
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

import { Input } from '../../components/ui/input';
import { Search } from 'lucide-react'; // Added Search icon
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { useWindowWidth } from '@react-hook/window-size'; // Using a web-compatible hook for window dimensions

interface AdditionalJob {
  job_title: string;
  vacancy: number;
  experience: string;
}

interface FormData {
  id?: string; // Add an optional ID for unique identification
  title: string;
  jobTitle: string;
  vacancy: string;
  // jobType: string;
  category: string;
  experience: string;
  // salary: string;
  // jobDescription: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
  // applicationDeadline: string;
  // additionalInfo: string;
  additional_jobs?: AdditionalJob[];
  isDraft?: boolean; // Add isDraft flag
  templateId?: string; // Add templateId for selected template
  templateStyle?: string; // Add templateStyle for selected template style
}

export default function PostJobsScreen() {
  const router = useRouter();
  const width = useWindowWidth(); // Using @react-hook/window-size
  const isSmallScreen = width < 768;
  const isMediumScreen = width >= 768 && width < 1024;

  const [form, setForm] = useState<FormData>({
    title: "",
    jobTitle: "",
    vacancy: "",
    // jobType: "",
    category: "",
    experience: "",
    // salary: "",
    // jobDescription: "",
    companyName: "",
    companyAddress: "",
    companyEmail: "",
    companyPhone: "",
    // applicationDeadline: "",
    // additionalInfo: "",
    additional_jobs: [],
  });

  const [isCategoryModalVisible, setCategoryModalVisible] = useState(false);
  const [isJobTypeModalVisible, setJobTypeModalVisible] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  // const jobTypes = [
  //   "Full Time",
  //   "Part Time",
  //   "Internship",
  //   "Contract",
  //   "Temporary",
  //   "Other",
  // ];

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleAdditionalJobChange = (index: number, field: keyof AdditionalJob, value: string | number) => {
    if (!form.additional_jobs) return;
    const updatedJobs = [...form.additional_jobs];
    if (field === "vacancy" && typeof value === "string") {
      updatedJobs[index][field] = Number(value);
    } else {
      updatedJobs[index][field] = value as never;
    }
    setForm({ ...form, additional_jobs: updatedJobs });
  };

  const handleRemoveAdditionalJob = (index: number) => {
    if (!form.additional_jobs) return;
    const updatedJobs = form.additional_jobs.filter((_, i) => i !== index);
    setForm({ ...form, additional_jobs: updatedJobs });
  };

  const handleAddAdditionalJob = () => {
    if ((form.additional_jobs?.length ?? 0) >= 6) return;
    const newJob: AdditionalJob = { job_title: "", vacancy: 0, experience: "" };
    setForm((prev) => ({
      ...prev,
      additional_jobs: [...(prev.additional_jobs ?? []), newJob],
    }));
  };

  const handleSaveJob = async (action: "draft" | "template") => {
    const required: (keyof FormData)[] = [
      "title",
      "jobTitle",
      "vacancy",
      "category",
      "experience",
      "companyName",
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
      // Using toast.error instead of Alert.alert
      toast.error(`Please fill in all required fields: ${missing.join(", ")}`);
      return;
    }

    if (!user) {
      toast.error("You must be logged in to post a job."); // Using toast.error
      return;
      }

    try {
      const jobData = {
        title: form.title,
        job_title: form.jobTitle,
        vacancy: parseInt(form.vacancy, 10),
        // job_type: form.jobType,
        category: form.category,
        experience: form.experience,
        // salary: form.salary,
        // job_description: form.jobDescription,
        company_name: form.companyName,
        company_address: form.companyAddress,
        company_email: form.companyEmail,
        company_phone: form.companyPhone,
        // application_deadline: form.applicationDeadline || null,
        // additional_info: form.additionalInfo,
        additional_jobs: form.additional_jobs, // include additional jobs here
        user_id: user.id,
        is_draft: action === "draft",
      };

      const { data, error } = await supabase.from("jobs").insert([jobData]).select();

      if (error) {
        throw error;
      }

      const newJobId = data?.[0]?.id;
      console.log("Job post saved to Supabase with ID:", newJobId);

      if (action === "draft") {
        toast.success("Job saved as draft!"); // Using toast.success
        router.push("/"); // Redirect to home page
      } else if (action === "template") {
        toast.success("Proceeding to template selection!"); // Using toast.success
        router.push(`/posts/templates?jobId=${newJobId}`); // Pass jobId to template page
      }
    } catch (e) {
      console.error("Error saving job post to Supabase:", e);
      toast.error("Error saving job post."); // Using toast.error
    }
  };

  const containerPadding = isSmallScreen ? 16 : isMediumScreen ? 40 : 80;

  // ThemedText and ThemedView are for React Native, not directly for web without react-native-web
  // Replacing with standard HTML elements and inline styles.
  // const colorScheme = useColorScheme();
  // const themedBackgroundColor = Colors[colorScheme ?? 'light'].background;
  // const textColor = Colors[colorScheme ?? 'light'].text;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
      }}
    >
      <div
        style={{
          paddingTop: 24,
          paddingBottom: 24,
          paddingLeft: containerPadding,
          paddingRight: containerPadding,
          backgroundColor: '#F9FAFB',
          maxWidth: 1200,
          margin: '0 auto',
          width: '100%',
        }}
        className="flex-grow overflow-auto" // mimic ScrollView
      >
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#111827', marginBottom: 8 }}>Post a New Job</h1>
          <p style={{ fontSize: '15px', color: '#6B7280', textAlign: 'center' }}>Fill out the form below to post a job application.</p>
        </div>

        {/* Job Information Section */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>Job Information</p>

          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="posterTitle" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Poster Title <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span></label>
            <Input
              id="posterTitle"
              placeholder="e.g., Mega Hiring Drive 2025"
              className={`border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500 ring-2 ring-red-500' : ''}`}
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* Job Title & Vacancy */}
          <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 16 }}>
            <div style={{ marginBottom: 16, flex: 1 }}>
              <label htmlFor="jobPosition" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>
                Job Position <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span>
              </label>
              <Input
                id="jobPosition"
                placeholder="e.g., Software Engineer"
                className={`border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.jobTitle ? 'border-red-500 ring-2 ring-red-500' : ''}`}
                value={form.jobTitle}
                onChange={(e) => handleChange("jobTitle", e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 16, flex: 1 }}>
              <label htmlFor="vacancy" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>
                Number of Vacancies <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span>
              </label>
              <Input
                id="vacancy"
                placeholder="e.g., 5"
                className={`border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.vacancy ? 'border-red-500 ring-2 ring-red-500' : ''}`}
                type="number" // keyboardType="numeric"
                value={form.vacancy}
                onChange={(e) => handleChange("vacancy", e.target.value)}
              />
            </div>
          </div>

          {/* Category & Job Type */}
          <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 16 }}>
            <div style={{ marginBottom: 16, flex: 1 }}>
              <label htmlFor="category" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Category <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span></label>
              <Button
                id="category"
                variant="outline"
                className={`w-full justify-between border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base min-h-[48px] ${errors.category ? 'border-red-500 ring-2 ring-red-500' : ''}`}
                onClick={() => setCategoryModalVisible(true)}
              >
                <span className={form.category ? 'text-[#111827]' : 'text-[#9CA3AF]'}>{form.category || "Select a category"}</span>
          <Search size={16} className="h-4 w-4 opacity-50" /> {/* Placeholder icon */}
              </Button>
            </div>

            {/* Uncomment if needed for job type */}
            {/* <div style={{ marginBottom: 16, flex: 1 }}>
              <label htmlFor="jobType" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Job Type</label>
              <Button
                id="jobType"
                variant="outline"
                className="w-full justify-between border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base min-h-[48px]"
                onClick={() => setJobTypeModalVisible(true)}
              >
                <span className={form.jobType ? 'text-[#111827]' : 'text-[#9CA3AF]'}>{form.jobType || "Select job type"}</span>
                <Search className="h-4 w-4 opacity-50" />
              </Button>
            </div> */}
          </div>

          {/* Experience & Salary */}
          <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 16 }}>
            <div style={{ marginBottom: 16, flex: 1 }}>
              <label htmlFor="experience" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>
                Experience Required <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span>
              </label>
              <Input
                id="experience"
                placeholder="e.g., Fresher or 2-5 years"
                className={`border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.experience ? 'border-red-500 ring-2 ring-red-500' : ''}`}
                value={form.experience}
                onChange={(e) => handleChange("experience", e.target.value)}
              />
            </div>

            {/* Uncomment if needed for salary */}
            {/* <div style={{ marginBottom: 16, flex: 1 }}>
              <label htmlFor="salary" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Salary Range</label>
              <Input
                id="salary"
                placeholder="e.g., 3-5 LPA"
                className="border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.salary}
                onChange={(e) => handleChange("salary", e.target.value)}
              />
            </div> */}
          </div>

          {/* Additional Jobs Section */}
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: 12 }}>Additional Job Positions</p>
              {form.additional_jobs?.map((job: AdditionalJob, idx: number) => (
                <div key={idx} style={{ marginBottom: 16, borderWidth: 1, borderColor: '#e0e0e0', padding: 12, borderRadius: 8 }}>
                  <Input
                    placeholder="Job Title"
                    className="mb-3"
                    value={job.job_title}
                    onChange={(e) => handleAdditionalJobChange(idx, "job_title", e.target.value)}
                  />
                  <Input
                    placeholder="Vacancy"
                    className="mb-3"
                    type="number"
                    value={job.vacancy.toString()}
                    onChange={(e) => handleAdditionalJobChange(idx, "vacancy", e.target.value)}
                  />
                  <Input
                    placeholder="Experience"
                    className="mb-3"
                    value={job.experience}
                    onChange={(e) => handleAdditionalJobChange(idx, "experience", e.target.value)}
                  />
                  <Button
                    style={{ backgroundColor: "#EF4444" }}
                    onClick={() => handleRemoveAdditionalJob(idx)}
                  >
                    <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '16px', letterSpacing: 0.5 }}>Remove</span>
                  </Button>
                </div>
              ))}
              {(form.additional_jobs?.length ?? 0) < 5 && (
                <Button style={{ backgroundColor: "#2563EB" }} onClick={handleAddAdditionalJob}>
                  <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '16px', letterSpacing: 0.5 }}>Add Another Job Position</span>
                </Button>
              )}
            </div>
          </div>
          
          {/* Company Information Section */}
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>Company Information</p>
            
            {/* Company Name & Address */}
            <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 16 }}>
              <div style={{ marginBottom: 16, flex: 1 }}>
                <label htmlFor="companyName" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Company Name <span style={{ color: '#EF4444', fontWeight: '700' }}>*</span></label>
                <Input
                  id="companyName"
                  placeholder="e.g., TCS"
                  className={`border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.companyName ? 'border-red-500 ring-2 ring-red-500' : ''}`}
                  value={form.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                />
              </div>

              <div style={{ marginBottom: 16, flex: 1 }}>
                <label htmlFor="companyAddress" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Company Location</label>
                <Input
                  id="companyAddress"
                  placeholder="e.g., Coimbatore, Tamil Nadu"
                  className="border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.companyAddress}
                  onChange={(e) => handleChange("companyAddress", e.target.value)}
                />
              </div>
            </div>
            
            {/* Company Email & Phone */}
            <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 16 }}>
              <div style={{ marginBottom: 16, flex: 1 }}>
                <label htmlFor="companyEmail" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Company Email</label>
                <Input
                  id="companyEmail"
                  placeholder="e.g., careers@company.com"
                  className="border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="email" // keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.companyEmail}
                  onChange={(e) => handleChange("companyEmail", e.target.value)}
                />
              </div>

              <div style={{ marginBottom: 16, flex: 1 }}>
                <label htmlFor="companyPhone" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Company Phone</label>
                <Input
                  id="companyPhone"
                  placeholder="e.g., +91 98765 43210"
                  className="border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="tel" // keyboardType="phone-pad"
                  value={form.companyPhone}
                  onChange={(e) => handleChange("companyPhone", e.target.value)}
                />
              </div>
            </div>
          </div>
          
          {/* Additional Details Section */}
          {/* <div style={{ backgroundColor: '#FFFFFF', borderRadius: 12, padding: 20, marginBottom: 20, boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}> */}
            {/* <p type="defaultSemiBold" style={{ fontSize: '18px', fontWeight: '600', color: '#111827', marginBottom: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#E5E7EB' }}>Additional Details</p> */}
            
            {/* Application Deadline */}
            {/* <div style={{ marginBottom: 16 }}> */}
              {/* <label htmlFor="applicationDeadline" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Application Deadline</label> */}
              {/* <Input
                id="applicationDeadline"
                placeholder="e.g., 2025-12-31"
                className="border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[48px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.applicationDeadline}
                onChange={(e) => handleChange("applicationDeadline", e.target.value)}
              />
              <p type="default" style={{ fontSize: '12px', color: '#6B7280', marginTop: 4, fontStyle: 'italic' }}>Format: YYYY-MM-DD</p> */}
            {/* </div> */}
            
            {/* Additional Info */}
            {/* <div style={{ marginBottom: 16 }}> */}
              {/* <label htmlFor="additionalInfo" style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: 8, display: 'block' }}>Additional Information</label>
              <textarea
                id="additionalInfo"
                placeholder="Interview process, benefits, contact details, etc."
                className="border-[#D1D5DB] rounded-lg bg-white py-3 px-3 text-base text-[#111827] min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                rows={4}
                value={form.additionalInfo}
                onChange={(e) => handleChange("additionalInfo", e.target.value)}
              /> */}
            {/* </div> */}
          {/* </div> */}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: isSmallScreen ? 'column' : 'row', gap: 16, marginTop: 20, justifyContent: 'space-between' }}>
          <Button
            className="flex-1"
            style={{
              backgroundColor: "#6B7280", // A different color for draft
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 32,
              paddingRight: 32,
              borderRadius: 10,
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(107, 114, 128, 0.25)",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.1s",
            }}
            onClick={() => handleSaveJob("draft")}
          >
            <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '16px', letterSpacing: 0.5 }}>Save as Draft</span>
          </Button>

          <Button
            className="flex-1"
            style={{
              backgroundColor: "#2563EB",
              paddingTop: 16,
              paddingBottom: 16,
              paddingLeft: 32,
              paddingRight: 32,
              borderRadius: 10,
              alignItems: "center",
              boxShadow: "0 4px 12px rgba(37, 99, 235, 0.25)",
              cursor: "pointer",
              transition: "background-color 0.2s, transform 0.1s",
            }}
            onClick={() => handleSaveJob("template")}
          >
            <span style={{ color: '#FFFFFF', fontWeight: '700', fontSize: '16px', letterSpacing: 0.5 }}>Proceed with Templates</span>
          </Button>
        </div>

        {/* Bottom Padding for mobile */}
        <div style={{ height: 40 }} />
      </div>

      <SelectionModal
        isVisible={isCategoryModalVisible}
        data={JOB_CATEGORIES}
        onSelect={(value) => {
          handleChange("category", value);
          setCategoryModalVisible(false);
        }}
        onClose={() => setCategoryModalVisible(false)}
        title="Select Job Category"
        selectedValue={form.category}
      />
      
      {/* <SelectionModal
        isVisible={isJobTypeModalVisible}
        data={jobTypes}
        onSelect={(value) => {
          handleChange("jobType", value);
          setJobTypeModalVisible(false);
        }}
        onClose={() => setJobTypeModalVisible(false)}
        title="Select Job Type"
        selectedValue={form.jobType}
      /> */}
    </div>
  );
}
