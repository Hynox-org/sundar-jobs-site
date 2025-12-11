'use client';

import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { JOB_CATEGORIES } from "@/constants/jobCategories";
import Header from "@/components/layout/header";

interface AdditionalJob {
  job_title: string;
  vacancy: number;
  experience: string;
}

interface FormData {
  id?: string;
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
  isDraft?: boolean;
  templateId?: string;
  templateStyle?: string;
}

export default function PostJobPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams?.get('jobId');

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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, boolean>>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (jobId) {
        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", jobId)
          .single();

        if (error) {
          console.error("Error fetching job details:", error);
          alert("Error fetching job details.");
          router.push("/yourpost");
          return;
        }

        if (data) {
          setForm({
            id: data.id,
            title: data.title,
            jobTitle: data.job_title,
            vacancy: data.vacancy?.toString(),
            category: data.category,
            experience: data.experience?.toString(),
            companyName: data.company_name,
            companyAddress: data.company_address,
            companyEmail: data.company_email,
            companyPhone: data.company_phone,
            additional_jobs: data.additional_jobs || [],
            isDraft: data.is_draft,
          });
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [jobId]);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleAdditionalJobChange = (
    index: number,
    field: keyof AdditionalJob,
    value: string | number
  ) => {
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
      alert(`Please fill in all required fields: ${missing.join(", ")}`);
      return;
    }

    if (!form.companyPhone && !form.companyEmail && !form.companyAddress) {
      alert("Please provide at least one company contact detail (email, phone, or address).");
      return;
    }

    if (!user) {
      alert("You must be logged in to post a job.");
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
        additional_jobs: form.additional_jobs,
        user_id: user.id,
        is_draft: action === "draft",
      };

      const filteredAdditionalJobs =
        jobData.additional_jobs?.filter(
          (job) =>
            job.job_title !== "" || job.vacancy !== 0 || job.experience !== ""
        ) || [];

      const jobDataToSave = {
        ...jobData,
        additional_jobs: filteredAdditionalJobs,
      };

      let data, error;
      if (form.id) {
        ({ data, error } = await supabase
          .from("jobs")
          .update(jobDataToSave)
          .eq("id", form.id)
          .select());
      } else {
        ({ data, error } = await supabase
          .from("jobs")
          .insert([jobDataToSave])
          .select());
      }

      if (error) throw error;

      const newJobId = data?.[0]?.id || form.id;
      console.log("Job post saved to Supabase with ID:", newJobId);

      if (action === "draft") {
        alert("Job saved as draft!");
        router.push("/yourpost");
      } else if (action === "template") {
        alert("Proceeding to template selection!");
        router.push(`/postjobs/template?jobId=${newJobId}`);
        // router.push(`/postjobs/template`);
      }
    } catch (e) {
      console.error("Error saving job post to Supabase:", e);
      alert("Error saving job post.");
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        <View style={styles.loadingContainer}>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <Text style={styles.loadingText}>Loading job details...</Text>
        </View>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
      <Header />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.heading}>
              {jobId ? "Edit Job Post" : "Post a New Job"}
            </Text>
            <Text style={styles.subheading}>
              {jobId
                ? "Edit the job application details below."
                : "Fill out the form below to post a job application."}
            </Text>
          </View>

          {/* Job Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Job Information</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Poster Title <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                placeholder="e.g., Mega Hiring Drive 2025"
                placeholderTextColor="#9CA3AF"
                style={[styles.input, errors.title && styles.inputError]}
                value={form.title}
                onChangeText={(text) => handleChange("title", text)}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>
                  Job Position <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="e.g., Software Engineer"
                  placeholderTextColor="#9CA3AF"
                  style={[styles.input, errors.jobTitle && styles.inputError]}
                  value={form.jobTitle}
                  onChangeText={(text) => handleChange("jobTitle", text)}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>
                  Number of Vacancies <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="e.g., 5"
                  placeholderTextColor="#9CA3AF"
                  style={[styles.input, errors.vacancy && styles.inputError]}
                  keyboardType="numeric"
                  value={form.vacancy}
                  onChangeText={(text) => handleChange("vacancy", text)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>
                  Category <Text style={styles.required}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[
                    styles.pickerWrapper,
                    errors.category && styles.inputError,
                  ]}
                  onPress={() => setCategoryModalVisible(true)}
                >
                  <Text
                    style={
                      form.category ? styles.pickerText : styles.placeholderText
                    }
                  >
                    {form.category || "Select a category"}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>
                  Experience Required <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="e.g., 2-5 years"
                  placeholderTextColor="#9CA3AF"
                  style={[styles.input, errors.experience && styles.inputError]}
                  value={form.experience}
                  onChangeText={(text) => handleChange("experience", text)}
                />
              </View>
            </View>

            {/* Additional Jobs Section */}
            <View style={{ marginVertical: 20 }}>
              <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
                Additional Job Positions
              </Text>
              {form.additional_jobs?.map((job: AdditionalJob, idx: number) => (
                <View
                  key={idx}
                  style={{
                    marginBottom: 16,
                    borderWidth: 1,
                    borderColor: "#e0e0e0",
                    padding: 12,
                    borderRadius: 8,
                  }}
                >
                  <TextInput
                    placeholder="Job Title"
                    style={[styles.input, { marginBottom: 10 }]}
                    value={job.job_title}
                    onChangeText={(text) =>
                      handleAdditionalJobChange(idx, "job_title", text)
                    }
                  />
                  <TextInput
                    placeholder="Vacancy"
                    style={[styles.input, { marginBottom: 10 }]}
                    keyboardType="numeric"
                    value={job.vacancy.toString()}
                    onChangeText={(text) =>
                      handleAdditionalJobChange(idx, "vacancy", text)
                    }
                  />
                  <TextInput
                    placeholder="Experience"
                    style={[styles.input, { marginBottom: 10 }]}
                    value={job.experience}
                    onChangeText={(text) =>
                      handleAdditionalJobChange(idx, "experience", text)
                    }
                  />
                  <TouchableOpacity
                    style={[styles.submitBtn, { backgroundColor: "#EF4444" }]}
                    onPress={() => handleRemoveAdditionalJob(idx)}
                  >
                    <Text style={styles.submitText}>Remove</Text>
                  </TouchableOpacity>
                </View>
              ))}
              {(form.additional_jobs?.length ?? 0) < 5 && (
                <TouchableOpacity
                  style={[styles.submitBtn, { backgroundColor: "#2563EB" }]}
                  onPress={handleAddAdditionalJob}
                >
                  <Text style={styles.submitText}>Add Another Job Position</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Company Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Company Information</Text>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>
                  Company Name <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  placeholder="e.g., TCS"
                  placeholderTextColor="#9CA3AF"
                  style={[styles.input, errors.companyName && styles.inputError]}
                  value={form.companyName}
                  onChangeText={(text) => handleChange("companyName", text)}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Company Location</Text>
                <TextInput
                  placeholder="e.g., Coimbatore, Tamil Nadu"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  value={form.companyAddress}
                  onChangeText={(text) => handleChange("companyAddress", text)}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Company Email</Text>
                <TextInput
                  placeholder="e.g., careers@company.com"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={form.companyEmail}
                  onChangeText={(text) => handleChange("companyEmail", text)}
                />
              </View>

              <View style={[styles.formGroup, styles.flex1]}>
                <Text style={styles.label}>Company Phone</Text>
                <TextInput
                  placeholder="e.g., +91 98765 43210"
                  placeholderTextColor="#9CA3AF"
                  style={styles.input}
                  keyboardType="phone-pad"
                  value={form.companyPhone}
                  onChangeText={(text) => handleChange("companyPhone", text)}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={[styles.row, styles.buttonGroup]}>
            <TouchableOpacity
              style={[styles.submitBtn, styles.draftBtn, styles.flex1]}
              onPress={() => handleSaveJob("draft")}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>Save as Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, styles.proceedBtn, styles.flex1]}
              onPress={() => handleSaveJob("template")}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>Proceed with Templates</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Category Modal */}
        {isCategoryModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Job Category</Text>
              <ScrollView style={{ maxHeight: 400 }}>
                {JOB_CATEGORIES.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.modalItem}
                    onPress={() => {
                      handleChange("category", category);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{category}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                style={styles.modalCloseBtn}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={styles.modalCloseBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </div>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#F9FAFB",
    maxWidth: 1200,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    marginBottom: 32,
    alignItems: "center",
  },
  heading: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
    fontWeight: "700",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
    minHeight: 48,
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 2,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    minHeight: 48,
    justifyContent: "center",
    paddingHorizontal: 14,
  },
  pickerText: {
    fontSize: 15,
    color: "#111827",
    paddingVertical: 12,
  },
  placeholderText: {
    fontSize: 15,
    color: "#9CA3AF",
    paddingVertical: 12,
  },
  row: {
    flexDirection: "row",
    gap: 16,
  },
  flex1: {
    flex: 1,
  },
  buttonGroup: {
    marginTop: 20,
    justifyContent: "space-between",
  },
  submitBtn: {
    backgroundColor: "#2563EB",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  draftBtn: {
    backgroundColor: "#6B7280",
  },
  proceedBtn: {
    backgroundColor: "#2563EB",
  },
  submitText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
    width: "100%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    color: "#111827",
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalItemText: {
    fontSize: 15,
    color: "#374151",
  },
  modalCloseBtn: {
    marginTop: 16,
    backgroundColor: "#6B7280",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  modalCloseBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
