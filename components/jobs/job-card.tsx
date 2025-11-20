import { useRouter } from "next/navigation"
import { Bookmark, SettingsIcon, LogOut, Briefcase, Users } from "lucide-react"

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

interface JobCardProps {
  job: JobPostFormData
}

export function JobCard({ job }: JobCardProps) {
  const router = useRouter()

  const colors = {
    tint: "#606C38", // Example color, replace with actual theme colors
    secondary: "#DDA15E", // Example color
    background: "#F8F9FA", // Example color
    text: "#212529", // Example color
    secondaryText: "#6C757D", // Example color
    border: "#DEE2E6", // Example color
    icon: "#495057" // Example color
  }

  return (
    <div className="bg-white mb-4 overflow-hidden shadow-md rounded-lg">
      <div className="flex">
        <div className="w-1 bg-gradient-to-b from-[#606C38] to-[#DDA15E]" /> {/* Left bar */}
        
        <div className="flex-1 p-4">
          {/* Compact header */}
          <div className="flex items-center mb-2">
            <span className="text-2xl font-bold text-[#606C38] mr-2">
              {String(job.id).padStart(2, '0')}
            </span>
            <div className="flex-1 h-px bg-[#DEE2E6]" /> {/* Horizontal line */}
          </div>

          {/* Compact job title */}
          <h3 className="text-xl font-bold mb-2 leading-tight tracking-tight text-[#212529]">
            {job.job_title.toUpperCase()}
          </h3>

          {/* Small category */}
          <div className="flex items-center mb-3">
            <div className="h-4 w-1 bg-[#DDA15E] mr-2" /> {/* Vertical bar */}
            <span className="text-xs font-bold tracking-wider uppercase text-[#495057]">
              {job.category.toUpperCase()}
            </span>
          </div>

          {/* Job Details as Text */}
          <div className="mt-1">
            <p className="text-xs font-bold mb-2 uppercase tracking-wider text-[#6C757D]">
              JOB TITLE
            </p>
            <p className="text-base leading-snug mb-1 text-[#212529]">
              {job.job_title}
            </p>

            {job.title && (
              <>
                <p className="text-xs font-bold mt-2 mb-2 uppercase tracking-wider text-[#6C757D]">
                  DESCRIPTION
                </p>
                <p className="text-base leading-snug mb-1 text-[#212529]">
                  {job.title}
                </p>
              </>
            )}
          </div>

          {/* Compact CTA */}
          <button
            onClick={() => router.push(`/preview?jobId=${job.id}&templateId=${job.template_id || ''}&templateStyle=${job.template_style || ''}`)}
            className="mt-3 py-3 px-4 flex items-center justify-between bg-[#606C38] text-white text-sm font-bold tracking-wider rounded-md w-full"
          >
            <span>VIEW</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </button>

          {/* Share with WhatsApp Button */}
          {/* Note: Share functionality needs to be implemented using Web Share API or a custom solution for web */}
          <button
            onClick={() => {
              const jobDetails = `
🌟 *New Job Opportunity!* 🌟

*Job Title:* ${job.job_title}
*Category:* ${job.category}
*Description:* ${job.title || 'N/A'}
*Job Type:* ${job.job_type || 'N/A'}
*Vacancy:* ${job.vacancy || 'N/A'}
*Experience:* ${job.experience || 'N/A'}
*Salary:* ${job.salary || 'N/A'}
*Job Description:* ${job.job_description || 'N/A'}
*Company Name:* ${job.company_name || 'N/A'}
*Company Address:* ${job.company_address || 'N/A'}
*Company Email:* ${job.company_email || 'N/A'}
*Company Phone:* ${job.company_phone || 'N/A'}
*Application Deadline:* ${job.application_deadline || 'N/A'}
*Additional Info:* ${job.additional_info || 'N/A'}

💼 *View more details:* ${job.poster_url || `http://localhost:3000/preview?jobId=${job.id}&templateId=${job.template_id || ''}&templateStyle=${job.template_style || ''}`}

🚀 *Find more jobs like this on JobPoster!*
              `;
              if (navigator.share) {
                navigator.share({
                  title: `Job: ${job.job_title}`,
                  text: jobDetails,
                  url: job.poster_url || `http://localhost:3000/preview?jobId=${job.id}&templateId=${job.template_id || ''}&templateStyle=${job.template_style || ''}`,
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
              } else {
                // Fallback for browsers that do not support Web Share API
                alert('Web Share API is not supported in this browser. You can manually copy the job details.');
                console.log(jobDetails); // Log to console for manual copy
              }
            }}
            className="mt-2 py-3 px-4 flex items-center justify-center bg-[#25D366] text-white text-sm font-bold tracking-wider rounded-md w-full gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.557-3.844-1.557-5.873 0-6.559 5.356-11.916 11.916-11.916 3.107 0 6.096 1.224 8.355 3.483 2.251 2.261 3.481 5.253 3.481 8.358 0 6.558-5.356 11.916-11.918 11.916h-.008c-1.874 0-3.704-.562-5.249-1.698l-6.313 1.692zm6.724-1.822l-1.424-.381c-.966.313-1.99.467-3.04.467-5.272 0-9.58-4.308-9.58-9.58 0-2.09.682-4.041 1.86-5.603l-.47-1.396 1.5.011c1.542.06 2.949-.364 4.099-1.291l1.111-.856 1.488 1.474c.957.943 2.247 1.455 3.594 1.455 1.701 0 3.324-.672 4.542-1.907l.799-.817c.563-.574 1.346-.922 2.19-.922 1.83 0 3.315 1.485 3.315 3.316 0 2.21-1.815 4.016-4.045 4.016-1.12 0-2.18-.517-2.997-1.423l-1.009-.949-.861.833c-1.378 1.336-3.238 2.066-5.187 2.066-1.555 0-3.051-.527-4.249-1.552l-1.011-.84-1.284.343zm1.181 3.565l.006-.002c-.899.243-1.84.363-2.782.363-.943 0-1.891-.122-2.775-.369l-.782.209c-.38.102-.796-.06-.975-.41l-.976-1.888 1.33-.355c.846-.226 1.63-.483 2.36-.76l.325.26c1.157.925 2.531 1.433 3.967 1.433 1.156 0 2.259-.395 3.166-1.135l.435-.355.679.658c.847.818 1.989 1.267 3.23 1.267.433 0 .86-.062 1.263-.18l.783.758c.15.143.351.213.551.213.155 0 .31-.044.457-.13l.977-.557c.38-.217.48-.687.23-1.066l-.004-.007c-.496-.757-.962-1.536-1.41-2.327-.514-.882-.969-1.786-1.385-2.697-.333-.728-.592-1.47-.775-2.223-.195-.776-.289-1.558-.289-2.336 0-3.018 2.454-5.474 5.474-5.474.965 0 1.905.253 2.72.735l.006-.002c.484.281 1.05.337 1.583.153l.89-.311.238.455c.164.314.542.449.882.355l1.634-.44c.34-.091.603-.404.603-.78c0-.39-.28-.716-.67-.866l-1.86-.68c-.68-.249-1.3-.61-1.86-1.077l-1.127-.887c-.897-.7-2.029-1.086-3.197-1.086-1.034 0-2.043.255-2.934.743l-.707-.002c-.378 0-.712-.234-.858-.598l-.488-1.216c-.201-.5-.77-.73-1.246-.531l-1.745.719c-.475.195-.758.64-.672 1.127l.002.007c.07.39.214.773.435 1.144.33.567.683 1.138 1.05 1.708l.37.581c-.53.473-1.002.977-1.41 1.517-.674.88-.992 1.84-.992 2.802 0 .61.085 1.22.257 1.815.195.688.487 1.34.86 1.968z"/>
            </svg>
            <span>SHARE ON WHATSAPP</span>
          </button>
        </div>
      </div>

      {/* Thin bottom stripe */}
      <div className="h-1 bg-gradient-to-r from-[#606C38] to-[#DDA15E]" />
    </div>
  )
}
