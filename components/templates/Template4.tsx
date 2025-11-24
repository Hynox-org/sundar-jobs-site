import { JobPostFormData } from "../../constants/jobTemplates";

export function generateTemplate4Html({ formData }: { formData: JobPostFormData }): string {
  if (!formData) return '<h1>Loading...</h1>';

  // Colors for vibrant dark theme without shadows
  const backgroundColor = '#121212'; // Dark background
  const primaryColor = '#00FFFF';    // Bright cyan primary
  const secondaryColor = '#7B2FF7';  // Deep purple secondary
  const textColor = '#E0E0E0';       // Light gray text
  const fontFamily = "'Poppins', sans-serif";

  // Calculate totals & scale factor
  const mainJobCount = formData.job_title ? 1 : 0;
  const additionalJobCount = formData.additional_jobs?.length || 0;
  const totalJobs = mainJobCount + additionalJobCount;
  const scaleFactor = totalJobs <= 1 ? 1 : totalJobs >= 6 ? 0.6 : 1 - (totalJobs - 1) * 0.08;

  // Font sizes scaled
  const jobTitleFontSize = (36 * scaleFactor).toFixed(2);
  const jobReqFontSize = (15 * scaleFactor).toFixed(2);
  const nosFontSize = (20 * scaleFactor).toFixed(2);
  const companyNameFontSize = (42 * scaleFactor).toFixed(2);
  const contactFontSize = (18 * scaleFactor).toFixed(2);
  const phoneFontSize = (28 * scaleFactor).toFixed(2);
  const footerFontSize = (22 * scaleFactor).toFixed(2);

  // Margins and gaps
  const marginHeader = 90 - (totalJobs - 1) * 12 > 25 ? 90 - (totalJobs - 1) * 12 : 25;
  const marginJobSection = 80 - (totalJobs - 1) * 14 > 18 ? 80 - (totalJobs - 1) * 14 : 18;
  const gapBetweenJobs = 18 * scaleFactor;
  const gapFooterToContact = 35 * scaleFactor;
  const contactHeight = 70 * scaleFactor;

  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

      @page {
        size: A4;
        margin: 0;
      }

      * {
        // margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      @media print {
        html, body, .container, * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          background-color: inherit !important;
          color: inherit !important;
          box-shadow: none !important;
          filter: none !important;
          text-shadow: none !important;
        }
        html, body {
          background-color: #121212 !important;
          color: #E0E0E0 !important;
        }
        .container {
          background-color: #1e1e2f !important;
        }
      }

      html, body {
        width: 100%;
        height: 100%;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        // background: ${backgroundColor};
        font-family: ${fontFamily};
        color: ${textColor};
      }

      body {
        background: ${backgroundColor};
      }

      .container {
        width: 210mm;
        min-height: 297mm;
        max-height: auto;
        background: #1e1e2f;
        position: relative;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
        padding: 40px 50px;
        justify-content: center;
        height: 100vh;
        border-radius: 15px;
      }
      .main-content {
        display: flex;
        flex-direction: column;
        justify-content: center;    /* center children vertically */
        flex-grow: 1;               /* fill container height */
      }
      /* Megaphone Icon */
      .megaphone-icon {
        position: absolute;
        top: 30px;
        left: 40px;
        width: 200px;
        height: 150px;
        z-index: 10;
      }

      .megaphone-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: none;
      }

      /* Header Section */
      .header-section {
        text-align: center;
        margin-bottom: ${marginHeader}px;
      }

      .we-are-hiring {
        font-size: 60px;
        font-weight: 900;
        color: ${primaryColor};
        text-transform: uppercase;
        letter-spacing: 5px;
        line-height: 1;
      }

      .we-are {
        color: ${secondaryColor};
      }

      /* Title below WE ARE HIRING */
      .we-are-hiring .title {
        font-size: 28px;
        font-weight: 600;
        margin-top: 12px;
        color: ${textColor};
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.3;
      }

      /* Job Positions Section */
      .job-positions-section {
        margin-bottom: ${marginJobSection}px;
      }

      .section-title {
        font-size: 26px;
        font-weight: 700;
        color: ${primaryColor};
        text-transform: uppercase;
        margin-bottom: 20px;
        letter-spacing: 2px;
        border-bottom: 3px solid ${primaryColor};
        padding-bottom: 10px;
        display: inline-block;
      }

      .job-item {
        background: rgba(0, 255, 255, 0.1);
        border: 2px solid ${primaryColor};
        border-left: 8px solid ${secondaryColor};
        border-radius: 10px;
        padding: ${25 * scaleFactor}px ${30 * scaleFactor}px;
        margin-bottom: ${gapBetweenJobs}px;
        text-align: left;
        color: ${textColor};
        position: relative;
      }

      .job-item::before {
        content: "➤";
        color: ${primaryColor};
        position: absolute;
        left: 12px;
        top: 50%;
        transform: translateY(-50%);
        font-size: ${jobTitleFontSize}px;
        font-weight: 900;
      }

      .job-title {
        font-size: ${jobTitleFontSize}px;
        font-weight: 900;
        color: ${textColor};
        text-transform: uppercase;
        margin-left: 30px;
        margin-bottom: ${12 * scaleFactor}px;
        letter-spacing: 2px;
        line-height: 1.1;
        display: inline-block;
      }

      .nos {
        font-size: ${nosFontSize}px;
        text-transform: lowercase;
        margin-left: 10px;
        color: ${secondaryColor};
        font-weight: 700;
      }

      .job-requirements {
        font-size: ${jobReqFontSize}px;
        font-weight: 500;
        color: ${textColor};
        line-height: 1.7;
        opacity: 0.85;
        margin-left: 30px;
        max-width: 70%;
      }

      /* Company Info Section */
      .company-section {
        background: rgba(123, 47, 247, 0.15);
        border-top: 3px solid ${secondaryColor};
        border-bottom: 3px solid ${secondaryColor};
        padding: ${20 * scaleFactor}px 0;
        margin-bottom: ${gapFooterToContact}px;
        min-height: ${contactHeight}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: ${20 * scaleFactor}px;
        color: ${textColor};
      }

      .company-name {
        font-size: ${companyNameFontSize}px;
        font-weight: 900;
        color: ${primaryColor};
        text-transform: uppercase;
        margin-bottom: ${20 * scaleFactor}px;
        letter-spacing: 3px;
      }

      .contact-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: ${30 * scaleFactor}px;
        flex-wrap: wrap;
        width: 100%;
        max-width: 700px;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: ${10 * scaleFactor}px;
        font-size: ${contactFontSize}px;
        font-weight: 600;
        min-width: 200px;
        justify-content: center;
        text-align: center;
        white-space: nowrap;
        color: ${textColor};
      }

      .icon {
        font-size: ${22 * scaleFactor}px;
      }

      .phone-number {
        font-size: ${phoneFontSize}px;
        font-weight: 900;
        color: ${primaryColor};
      }

      /* Footer / Marketing Section */
      .app-section {
        background: #222237;
        border-radius: 15px;
        padding: ${18 * scaleFactor}px ${25 * scaleFactor}px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${20 * scaleFactor}px;
        flex-wrap: wrap;
        font-size: ${footerFontSize}px;
        color: ${textColor};
      }

      .app-left {
        display: flex;
        align-items: center;
        gap: ${15 * scaleFactor}px;
      }

      .app-logo {
        width: ${55 * scaleFactor}px;
        height: ${55 * scaleFactor}px;
        background: ${primaryColor};
        border-radius: 15px;
        padding: ${8 * scaleFactor}px;
      }

      .app-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: none;
      }

      .app-name {
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 2px;
        color: ${primaryColor};
      }

      .app-right {
        display: flex;
        gap: ${12 * scaleFactor}px;
      }

      .store-badge {
        display: flex;
        align-items: center;
        gap: ${8 * scaleFactor}px;
        background: rgba(255, 255, 255, 0.25);
        padding: ${10 * scaleFactor}px ${15 * scaleFactor}px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .store-icon {
        width: ${28 * scaleFactor}px;
        height: ${28 * scaleFactor}px;
        background: ${secondaryColor};
        border-radius: 5px;
        padding: ${4 * scaleFactor}px;
      }

      .store-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: none;
      }

      .store-text {
        font-weight: 700;
        color: ${primaryColor};
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="megaphone-icon">
        <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/top-left1.png" alt="Megaphone" />
      </div>

      <div class="main-content">

        <!-- 1. Poster Title -->
        <div class="header-section">
          <div class="we-are-hiring">
            <span class="we-are">WE ARE</span><br>HIRING!
            <div class="title">${formData.title}</div>
          </div>
        </div>

        <!-- 2. Job Positions Section -->
        <div class="job-positions-section">
          <div class="section-title">JOB POSITION :</div>

          ${formData.job_title ? `
            <div class="job-item">
              <div class="job-title">${formData.job_title}<span> - (${formData.vacancy})</span><span class="nos">nos</span></div>
              <div class="job-requirements">${formData.experience ? `Experience: ${formData.experience}` : ''}</div>
            </div>
          ` : ''}

          ${formData.additional_jobs && formData.additional_jobs.length > 0
            ? formData.additional_jobs
                .map(
                  (job) => `
            <div class="job-item" style="margin-top: ${gapBetweenJobs}px; border-left: 8px solid ${secondaryColor}; padding-left: 12px;">
              <div class="job-title">${job.job_title}<span> - (${job.vacancy})</span><span class="nos">nos</span></div>
              <div class="job-requirements">${job.experience ? `Experience: ${job.experience}` : ''}</div>
            </div>
            `
                )
                .join('')
            : ''
          }
        </div>

        <!-- 3. Company Details Section -->
        <div class="company-section">
          ${formData.company_name ? `<div class="company-name">${formData.company_name}</div>` : ''}

          <div class="contact-row">
            ${formData.company_address ? `<div class="contact-item"><span class="icon">📍</span><span>${formData.company_address}</span></div>` : ''}
            ${formData.company_phone ? `<div class="contact-item"><span class="icon">📞</span><span class="phone-number">${formData.company_phone}</span></div>` : ''}
            ${formData.company_email ? `<div class="contact-item"><span class="icon">📧</span><span>${formData.company_email}</span></div>` : ''}
          </div>
        </div>

        <!-- 4. Footer / Marketing -->
        <div class="app-section">
          <div class="app-left">
            <div class="app-logo">
              <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/logo.png" alt="Logo" />
            </div>
            <div class="app-name">SUNDAR JOBS APP</div>
          </div>
          <div class="app-right">
            <div class="store-badge">
              <div class="store-icon">
                <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/playstore-icon.png" alt="Play Store" />
              </div>
              <div class="store-text">Android</div>
            </div>
            <div class="store-badge">
              <div class="store-icon">
                <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/appstore-icon.png" alt="App Store" />
              </div>
              <div class="store-text">iPhone</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </body>
</html>
  `;
}
