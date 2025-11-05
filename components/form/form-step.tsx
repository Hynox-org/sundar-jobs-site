"use client"

import type React from "react"

import type { FormErrors } from "@/utils/validation"

interface FormStepProps {
  formData: any
  errors: FormErrors
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
}

export default function FormStep({ formData, errors, onChange }: FormStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Job Title *</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={onChange}
            placeholder="e.g., Senior React Developer"
            className="input-field"
          />
          {errors.jobTitle && <p className="form-error">{errors.jobTitle}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Company Name *</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={onChange}
            placeholder="e.g., Tech Corp"
            className="input-field"
          />
          {errors.companyName && <p className="form-error">{errors.companyName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={onChange}
            placeholder="e.g., New York, NY"
            className="input-field"
          />
          {errors.location && <p className="form-error">{errors.location}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Job Type *</label>
          <select name="jobType" value={formData.jobType} onChange={onChange} className="input-field">
            <option value="">Select job type</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          {errors.jobType && <p className="form-error">{errors.jobType}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Salary Range *</label>
          <input
            type="text"
            name="salaryRange"
            value={formData.salaryRange}
            onChange={onChange}
            placeholder="e.g., $80k - $120k"
            className="input-field"
          />
          {errors.salaryRange && <p className="form-error">{errors.salaryRange}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Experience Required *</label>
          <input
            type="text"
            name="experienceRequired"
            value={formData.experienceRequired}
            onChange={onChange}
            placeholder="e.g., 3-5 years"
            className="input-field"
          />
          {errors.experienceRequired && <p className="form-error">{errors.experienceRequired}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-text">Job Description *</label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={onChange}
          placeholder="Describe the role, responsibilities, and what success looks like..."
          className="input-field h-24 resize-none"
        />
        {errors.jobDescription && <p className="form-error">{errors.jobDescription}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2 text-text">Key Requirements *</label>
        <textarea
          name="keyRequirements"
          value={formData.keyRequirements}
          onChange={onChange}
          placeholder="List key requirements, skills, and qualifications..."
          className="input-field h-24 resize-none"
        />
        {errors.keyRequirements && <p className="form-error">{errors.keyRequirements}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Contact Email *</label>
          <input
            type="email"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={onChange}
            placeholder="hr@company.com"
            className="input-field"
          />
          {errors.contactEmail && <p className="form-error">{errors.contactEmail}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Contact Phone *</label>
          <input
            type="tel"
            name="contactPhone"
            value={formData.contactPhone}
            onChange={onChange}
            placeholder="+1 (555) 123-4567"
            className="input-field"
          />
          {errors.contactPhone && <p className="form-error">{errors.contactPhone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Application Deadline *</label>
          <input
            type="date"
            name="applicationDeadline"
            value={formData.applicationDeadline}
            onChange={onChange}
            className="input-field"
          />
          {errors.applicationDeadline && <p className="form-error">{errors.applicationDeadline}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-text">Company Logo URL (Optional)</label>
          <input
            type="url"
            name="companyLogoUrl"
            value={formData.companyLogoUrl}
            onChange={onChange}
            placeholder="https://..."
            className="input-field"
          />
        </div>
      </div>
    </div>
  )
}
