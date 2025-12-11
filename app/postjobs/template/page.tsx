'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { HTML_TEMPLATES, HtmlTemplate } from '@/constants/jobTemplates';

interface FormData {
  id?: string;
  title: string;
  job_title: string;
  vacancy: number;
  category: string;
  experience: string;
  company_name: string;
  company_address: string;
  company_email: string;
  company_phone: string;
  is_draft?: boolean;
  template_id?: string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams?.get('jobId');

  const [jobPosts, setJobPosts] = useState<FormData[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<{ postId: string; template: HtmlTemplate } | null>(null);

  useEffect(() => {
    const loadJobPosts = async () => {
      try {
        if (!jobId) {
          console.warn("No jobId provided for templates screen.");
          setJobPosts([]);
          return;
        }

        const { data, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error) throw error;

        if (data) {
          setJobPosts([data]);
        } else {
          setJobPosts([]);
        }
      } catch (e) {
        console.error("Error loading job posts from Supabase:", e);
        alert("Failed to load job post.");
      }
    };

    loadJobPosts();
  }, [jobId]);

  const handleSelectTemplate = useCallback((template: HtmlTemplate, jobPost: FormData) => {
    setSelectedTemplate({ postId: jobPost.id!, template });
  }, []);

  const handleSaveTemplate = useCallback(async (action: "draft" | "preview") => {
    if (!jobId || !selectedTemplate) {
      alert("Please select a template.");
      return;
    }

    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          template_id: selectedTemplate.template.id,
          is_draft: true,
        })
        .eq('id', jobId);

      if (error) throw error;

      console.log(`Job post ${jobId} updated with template. Action: ${action}`);

      if (action === "draft") {
        alert("Job saved as draft with template details!");
        router.push("/");
      } else if (action === "preview") {
        alert("Proceeding to preview!");
        router.push(`/postjobs/preview?jobId=${jobId}&templateId=${selectedTemplate.template.id}`);
      }
    } catch (e) {
      console.error("Error updating job post with template details:", e);
      alert("Error saving template details.");
    }
  }, [jobId, selectedTemplate, router]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>Job Templates</Text>
        <Text style={styles.subtitle}>
          Select a template to preview your job post.
        </Text>

        {jobPosts.length === 0 ? (
          <Text style={styles.noPostsText}>
            No job posts available. Submit a job to see it here!
          </Text>
        ) : (
          jobPosts.map((post) => (
            <View key={post.id} style={styles.jobPostCard}>
              <Text style={styles.cardTitle}>{post.title}</Text>
              <Text style={styles.cardSubtitle}>
                {post.job_title} at {post.company_name}
              </Text>
              <Text style={styles.cardDetail}>Category: {post.category}</Text>
              <Text style={styles.cardDetail}>Experience: {post.experience}</Text>

              <View style={styles.templateSelectionContainer}>
                <Text style={styles.templateSelectionTitle}>Choose a Template:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.templateScroll}
                >
                  {HTML_TEMPLATES.map((template: HtmlTemplate) => {
                    const isSelected =
                      selectedTemplate?.postId === post.id &&
                      selectedTemplate?.template.id === template.id;

                    return (
                      <TouchableOpacity
                        key={template.id}
                        style={[
                          styles.templateOption,
                          {
                            backgroundColor: isSelected ? '#2563EB' : '#FFFFFF',
                            borderColor: isSelected ? '#2563EB' : '#E5E7EB',
                            borderWidth: isSelected ? 2 : 1,
                          },
                        ]}
                        onPress={() => handleSelectTemplate(template, post)}
                      >
                        <Text
                          style={[
                            styles.templateOptionText,
                            { color: isSelected ? '#FFFFFF' : '#374151' },
                          ]}
                        >
                          {template.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          ))
        )}

        {jobPosts.length > 0 && (
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.submitBtn, styles.draftBtn]}
              onPress={() => handleSaveTemplate("draft")}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>Save as Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitBtn, styles.proceedBtn]}
              onPress={() => handleSaveTemplate("preview")}
              activeOpacity={0.8}
            >
              <Text style={styles.submitText}>Proceed to Preview</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 900,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#6B7280',
  },
  noPostsText: {
    marginTop: 30,
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
  },
  jobPostCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 5,
    color: '#111827',
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 10,
  },
  cardDetail: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
  },
  templateSelectionContainer: {
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  templateSelectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '600',
    color: '#111827',
  },
  templateScroll: {
    paddingVertical: 5,
  },
  templateOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  templateOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: "column",
    gap: 16,
    marginTop: 20,
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
});
