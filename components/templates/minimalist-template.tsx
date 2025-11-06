import React from "react";

interface JobFormData {
  jobTitle: string;
  companyName: string;
  location: string;
  salaryRange: string;
  experienceRequired: string;
  jobType: string;
  jobDescription: string;
  keyRequirements: string;
  contactEmail: string;
  contactPhone: string;
  applicationDeadline: string;
  companyUrl: string;
  contactPhone2?: string;
  secondaryPosition?: string;
  secondaryExperience?: string;
  secondaryRequirement?: string;
  interviewDays?: string;
  interviewDateRange?: string;
}

interface ImageAssets {
  megaphoneIcon?: string;
  checkIcon?: string;
  phoneIcon?: string;
  playStoreIcon?: string;
  appStoreIcon?: string;
  appLogoIcon?: string;
  brandLogo?: string;
}

interface HiringPosterTemplateProps {
  formData: JobFormData;
  imageAssets?: ImageAssets;
}

export default function MinimalistTemplate({
  formData,
  imageAssets = {},
}: HiringPosterTemplateProps) {
  return (
    <div
      style={{
        backgroundImage: "url('/template2_bg.png')",
        width: "1080px",
        height: "1920px",
        padding: "0",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        position: "relative",
        fontFamily: '"Arial", sans-serif',
        color: "#000000",
      }}
    >
      {/* Company Name Header */}
      <div
        style={{
          position: "absolute",
          top: "6%",
          left: "10%",
          fontSize: "40px",
          fontWeight: "bold",
        }}
      >
        {formData.companyName}
      </div>

      {/* Main Content - Middle Column */}
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          textAlign: "center",
          color: "#222",
        }}
      >
        
        {/* Job Title */}
        <h1
          style={{
            fontSize: "50px",
            fontWeight: "bold",
            textTransform: "uppercase",
            // marginBottom: "30px",
          }}
        >
          {formData.jobTitle}
        </h1>

        {/* Job Details */}
        <div style={{ fontSize: "26px", fontWeight: "bold", lineHeight: "1.8", textAlign: "center" }}>
          <p>
            <strong>Experience:</strong> {formData.experienceRequired || "N/A"}
          </p>
          <p>
            <strong>Job Type:</strong> {formData.jobType || "N/A"}
          </p>
          <p>
            <strong>Location:</strong> {formData.location || "N/A"}
          </p>
          <p>
            <strong>Salary Range:</strong> {formData.salaryRange || "N/A"}
          </p>

          {/* Key Requirements */}
          <div>
            {formData.keyRequirements ? (
              <ul
                style={{
                  paddingLeft: "0",
                  listStyleType: "none",
                  textAlign: "center",
                }}
              >
                {formData.keyRequirements
                  .split(/[,.\n]+/)
                  .map((req, index) => {
                    const trimmed = req.trim();
                    if (!trimmed) return null;
                    return (
                      <li key={index} style={{ fontSize: "24px" }}>
                         {trimmed}
                      </li>
                    );
                  })}
              </ul>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Section - Near Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          color: "#000000",
          fontSize: "24px",
          lineHeight: "1.8",
        }}
      >
        <p>
          <strong>Contact us:</strong> {formData.contactEmail} |{" "}
          {formData.contactPhone}
        </p>
        <p>
          <strong>Last Date to Apply:</strong>{" "}
          {formData.applicationDeadline || "N/A"}
        </p>

        {formData.companyUrl && (
          <p style={{ marginTop: "10px" }}>
            <a
              href={formData.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#0056b3",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              {formData.companyUrl}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
