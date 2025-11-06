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
  companyUrl: string
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
      {/* Content goes here */}
      <div style={{position:"absolute",top:"5%",left:"10%", color: "#000000",fontSize:"40px",fontWeight:"bold"}}><p>{formData.companyName}</p></div>
      <div
        style={{
          position: "absolute",
          top: "53%",
          left: "53%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Job Title */}
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            color: "#000000",
            textTransform: "uppercase",
            marginBottom: "50px",
          }}
        >
          {formData.jobTitle}
        </h1>

        {/* Two Columns */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "80px",
            width: "100%",
          }}
        >
          {/* Left Column */}
          <div
            style={{
              flex: 1,
              color: "#555555",
              // padding: "30px",
              width:"50%",
              borderRadius: "15px",
              textAlign: "left",
              fontSize: "25px",
              lineHeight: "2",
            }}
          >
            <h5 style={{color:"#1a1110"}}>Qualifications</h5>
            <p>
              <strong>Experience:</strong>{" "}
              <span style={{ fontSize: "24px" }}>{formData.experienceRequired || "N/A"}</span>
            </p>
            <p>
              <strong>Job Type:</strong> <span style={{ fontSize: "24px" }}>{formData.jobType || "N/A"}</span>
            </p>
            <div>
              <strong>Key Requirements:</strong>
              {formData.keyRequirements ? (
                <ul style={{ marginTop: "10px", paddingLeft: "25px", lineHeight: "2" , listStyleType: "disc"}}>
                  {formData.keyRequirements
                    .split(/[,.\n]+/) // split by comma, period, or new line
                    .map((req, index) => {
                      const trimmed = req.trim()
                      if (!trimmed) return null
                      return (
                        <li key={index} style={{ fontSize: "24px" }}>
                          {trimmed}
                        </li>
                      )
                    }
                  )}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>

          </div>

          {/* Right Column */}
          <div
            style={{
              flex: 1,
              color: "#555555  ",
              // padding: "30px",
              width:"50%",
              borderRadius: "15px",
              textAlign: "left",
              fontSize: "24px",
              lineHeight: "2",
            }}
          >
            <h5 style={{color:"#1a1110"}}>Contact Details</h5>
            <p>
              <strong>Email:</strong> {formData.contactEmail || "N/A"}
            </p>
            <p>
              <strong>Phone:</strong> {formData.contactPhone || "N/A"}
            </p>
            <p>
              <strong>Location:</strong> {formData.location || "N/A"}
            </p>
            <p>
              <strong>Application Deadline:</strong><br />
              {formData.applicationDeadline || "N/A"}
            </p>

            {formData.companyUrl && (
              <p
                style={{
                  marginTop: "10px",
                  textAlign: "center",
                }}
              >
                <a href={formData.companyUrl} target="_blank" rel="noopener noreferrer">
                  {formData.companyUrl}
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
