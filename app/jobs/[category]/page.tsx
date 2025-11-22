"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import Header from "@/components/layout/header"
import { supabase } from "@/lib/supabase"
import { JobCard } from "@/components/jobs/job-card"

interface JobPostFormData {
  id: string
  title: string
  job_title: string
  vacancy: number
  job_type?: string
  category: string
  experience: string
  salary?: string
  job_description: string
  company_name?: string
  company_address?: string
  company_email: string
  company_phone?: string
  application_deadline?: string
  additional_info?: string
  poster_url?: string
  template_id?: string
  template_style?: string
}

export default function CategoryJobsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const category = searchParams.get('category') // Get category from query parameters

  const [jobs, setJobs] = useState<JobPostFormData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchJobsByCategory = async () => {
      if (!category) {
        setError("No category provided.")
        setIsLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('jobs')
          .select('id, title, job_title, vacancy, job_type, category, experience, salary, job_description, company_name, company_address, company_email, company_phone, application_deadline, additional_info, poster_url, template_id, template_style')
          .eq('category', category as string)
          .eq('is_draft', false);

        if (error) {
          throw error;
        }
        setJobs(data || []);
      } catch (e: any) {
        console.error("Error fetching jobs by category:", e);
        const errorMessage = e?.message || 'An unknown error occurred';
        setError(`Failed to load jobs for ${category}: ${errorMessage}`);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobsByCategory();
  }, [category])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Loading jobs for {category}...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-text mb-6 text-center">Jobs in {category}</h1>

        {jobs.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-2xl font-bold text-text mb-4">NO JOBS AVAILABLE</h3>
            <p className="text-text-muted">No positions in {category} right now. Check back later!</p>
            <button onClick={() => router.back()} className="mt-6 btn-primary px-6 py-2">
              ← Back to Categories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
