// components/templates/HiringPosterTemplate.tsx
import React from 'react'

interface JobFormData {
  jobTitle: string
  companyName: string
  location: string
  salaryRange: string
  experienceRequired: string
  jobType: string
  jobDescription: string
  keyRequirements: string
  contactEmail: string
  contactPhone: string
  applicationDeadline: string
  companyLogoUrl: string
  // Optional fields
  contactPhone2?: string
  secondaryPosition?: string
  secondaryExperience?: string
  secondaryRequirement?: string
  interviewDays?: string
  interviewDateRange?: string
}

interface ImageAssets {
  megaphoneIcon?: string
  checkIcon?: string
  phoneIcon?: string
  playStoreIcon?: string
  appStoreIcon?: string
  appLogoIcon?: string
  brandLogo?: string
}

interface HiringPosterTemplateProps {
  formData: JobFormData
  imageAssets?: ImageAssets
}

export default function HiringPosterTemplate({
  formData,
  imageAssets = {},
}: HiringPosterTemplateProps) {
  return (
    <div
       style={{
        backgroundImage: "url('/template1_bg.png')",
        width: '1080px',
        height: '1920px',
        padding: '0',
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",  // Keep background fixed when scrolling
        position: 'relative',
        fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif',
        color: '#ffffff',
      }}
    >
    </div>
  )
}
