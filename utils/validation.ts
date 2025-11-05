export interface FormErrors {
  [key: string]: string
}

export const validateForm = (data: any): FormErrors => {
  const errors: FormErrors = {}

  if (!data.jobTitle?.trim()) errors.jobTitle = "Job title is required"
  if (!data.companyName?.trim()) errors.companyName = "Company name is required"
  if (!data.location?.trim()) errors.location = "Location is required"
  if (!data.salaryRange?.trim()) errors.salaryRange = "Salary range is required"
  if (!data.experienceRequired?.trim()) errors.experienceRequired = "Experience required is needed"
  if (!data.jobType) errors.jobType = "Job type is required"
  if (!data.jobDescription?.trim()) errors.jobDescription = "Job description is required"
  if (!data.keyRequirements?.trim()) errors.keyRequirements = "Key requirements are required"

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!data.contactEmail?.trim()) {
    errors.contactEmail = "Contact email is required"
  } else if (!emailRegex.test(data.contactEmail)) {
    errors.contactEmail = "Please enter a valid email"
  }

  const phoneRegex = /^[\d\s\-+$$$$]{10,}$/
  if (!data.contactPhone?.trim()) {
    errors.contactPhone = "Contact phone is required"
  } else if (!phoneRegex.test(data.contactPhone)) {
    errors.contactPhone = "Please enter a valid phone number"
  }

  if (!data.applicationDeadline) errors.applicationDeadline = "Application deadline is required"

  return errors
}

export const getFormCompletion = (data: any): number => {
  const requiredFields = [
    "jobTitle",
    "companyName",
    "location",
    "salaryRange",
    "experienceRequired",
    "jobType",
    "jobDescription",
    "keyRequirements",
    "contactEmail",
    "contactPhone",
    "applicationDeadline",
  ]

  const filledFields = requiredFields.filter((field) => data[field]?.toString().trim())
  return Math.round((filledFields.length / requiredFields.length) * 100)
}
