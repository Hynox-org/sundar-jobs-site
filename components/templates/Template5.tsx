import { JobPostFormData } from "../../constants/jobTemplates";

export function generateTemplate5Html({
  formData,
  backgroundColor,
  textColor,
  primaryColor,
  secondaryColor,
  fontFamily,
}: {
  formData: JobPostFormData;
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
}): string {
  if (!formData) return "<h1>Loading...</h1>";

  // Compute total job count for scaling and spacing
  const mainJobCount = formData.job_title ? 1 : 0;
  const additionalJobCount = formData.additional_jobs?.length || 0;
  const totalJobs = mainJobCount + additionalJobCount;

  // Scale factor for font size (1 for 1 job, 0.65 for 6+ jobs)
  const scaleFactor =
    totalJobs <= 1 ? 1 : totalJobs >= 6 ? 0.65 : 1 - (totalJobs - 1) * 0.07;

  // Font sizes scaled
  const jobTitleFontSize = (36 * scaleFactor).toFixed(2);
  const jobReqFontSize = (15 * scaleFactor).toFixed(2);
  const nosFontSize = (20 * scaleFactor).toFixed(2);

  // Margins and gaps
  const marginHeader =
    80 - (totalJobs - 1) * 10 > 28 ? 80 - (totalJobs - 1) * 10 : 28;
  const marginJobSection =
    70 - (totalJobs - 1) * 10 > 20 ? 70 - (totalJobs - 1) * 10 : 20;
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
        html, body {
          background-color: ${backgroundColor} !important;
          color: ${textColor} !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
      }

      /* Apply colors to main containers */
      .container {
        background-color: ${backgroundColor} !important;
      }

      /* Preserve your text colors for headings and key sections */
      .we-are-hiring {
        color: ${textColor} !important;
      }
      .we-are {
        color: ${primaryColor} !important;
      }
      .section-title {
        color: ${primaryColor} !important;
      }
      .job-item {
        background-color: ${primaryColor}33 !important; /* translucent */
        border-color: ${primaryColor} !important;
        color: ${textColor} !important;
      }
      .job-title {
        color: ${textColor} !important;
      }
      .job-requirements {
        color: ${textColor} !important;
      }
      .company-section {
        background-color: ${primaryColor}10 !important; /* translucent bg */
        border-top: 3px solid ${primaryColor} !important;
        border-bottom: 3px solid ${primaryColor} !important;
        color: ${textColor} !important;
      }
      .company-name {
        color: ${primaryColor} !important;
      }
      .contact-item {
        color: ${textColor} !important;
      }
      .app-section {
        background-color: ${textColor} !important;
        color: #FFFFFF !important;
        page-break-inside: avoid !important;
        break-inside: avoid !important;
        page-break-before: avoid !important;
        page-break-after: avoid !important;
        box-shadow: none !important;
      }
      .app-left, .app-right {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      /* To avoid splitting sections across pages */
      .main-content,
      .job-positions-section,
      .company-section,
      .app-section {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      /* Prevent page breaks before/after footer if needed */
      .app-section {
        page-break-before: avoid !important;
        page-break-after: avoid !important;
      }
      /* Remove text-shadow/filter effects for clarity */
      * {
        text-shadow: none !important;
        filter: none !important;
      }
    }

      html,
      body {
        width: 100%;
        height: 100%;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        padding: 0;
        // background: ${backgroundColor};
        font-family: ${fontFamily};
        color: ${textColor};
      }

      body {
        font-family: ${fontFamily};
      }

      .container {
        width: 210mm;
        min-height: 297mm;
        max-height: auto;
        background: ${backgroundColor};
        position: relative;
        display: flex;
        flex-direction: column;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        padding: 40px 50px;
        justify-content: space-between;
        height: 95vh;
        border-radius: 15px;
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
      }

      /* Main Content */
      .main-content {
        display: flex;
        flex-direction: column;
        justify-content: center;    /* center children vertically */
        flex-grow: 1;               /* fill container height */
        position: relative;
        z-index: 5;
      }

      /* Section 1: Header */
      .header-section {
        text-align: center;
        margin-bottom: ${marginHeader}px;
      }

      .we-are-hiring {
        font-size: 70px;
        font-weight: 900;
        color: ${textColor};
        text-transform: uppercase;
        letter-spacing: 5px;
        line-height: 1;
      }

      .we-are {
        color: ${primaryColor};
      }

      /* Title below WE ARE HIRING */
      .we-are-hiring .title {
        font-size: 28px;
        font-weight: 600;
        color: ${textColor};
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
        line-height: 1.3;
      }

      /* Section 2: Job Positions */
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
        display: inline-block;
      }

      .job-item {
        background: ${primaryColor}15;
        border: 2px solid ${primaryColor};
        border-left: 8px solid ${primaryColor};
        border-radius: 10px;
        padding: ${25 * scaleFactor}px ${30 * scaleFactor}px;
        margin-bottom: ${gapBetweenJobs}px;
        text-align: center;
      }

      .job-title {
        font-size: ${jobTitleFontSize}px;
        font-weight: 900;
        color: ${textColor};
        text-transform: uppercase;
        margin-bottom: ${12 * scaleFactor}px;
        letter-spacing: 2px;
        line-height: 1.1;
        display: inline-block;
      }

      .nos {
        font-size: ${nosFontSize}px;
        text-transform: lowercase;
        margin-left: 6px;
      }

      .job-requirements {
        font-size: ${jobReqFontSize}px;
        font-weight: 500;
        color: ${textColor};
        line-height: 1.7;
        opacity: 0.85;
        text-align: center;
        margin: 0 auto;
        max-width: 60%;
      }

      /* Section 3: Company Info */
      .company-section {
        background: ${primaryColor}10;
        border-top: 3px solid ${primaryColor};
        border-bottom: 3px solid ${primaryColor};
        margin-bottom: ${gapFooterToContact}px;
        min-height: ${contactHeight}px;
      }

      .company-name {
        font-size: 42px;
        font-weight: 900;
        color: ${primaryColor};
        text-transform: uppercase;
        text-align: center;
        letter-spacing: 3px;
      }

      .contact-row {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 30px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: 600;
        color: ${textColor};
      }

      .icon {
        font-size: 22px;
      }

      .phone-number {
        font-size: 28px;
        font-weight: 900;
        color: ${primaryColor};
      }

      /* Section 4: Footer / Marketing */
      .app-section {
        background: ${textColor};
        border-radius: 10px;
        padding: 18px 25px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 20px;
        flex-wrap: wrap;
      }

      .app-left {
        display: flex;
        align-items: center;
        gap: 15px;
      }

      .app-logo {
        width: 55px;
        height: 55px;
        background: #FFFFFF;
        border-radius: 10px;
        padding: 8px;
      }

      .app-logo img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .app-name {
        font-size: 22px;
        font-weight: 900;
        color: #FFFFFF;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .app-right {
        display: flex;
        gap: 12px;
      }

      .store-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        background: rgba(255, 255, 255, 0.15);
        padding: 10px 15px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
      }

      .store-icon {
        width: 28px;
        height: 28px;
        background: #FFFFFF;
        border-radius: 5px;
        padding: 4px;
      }

      .store-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .store-text {
        font-size: 11px;
        font-weight: 700;
        color: #FFFFFF;
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

          ${
            formData.additional_jobs && formData.additional_jobs.length > 0
              ? formData.additional_jobs
                  .map(
                    (job) => `
            <div class="job-item" style="margin-top: ${gapBetweenJobs}px; border-left: 8px solid ${primaryColor}; padding-left: 12px;">
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
        <div class="company-section" style="min-height: ${contactHeight}px; margin-bottom: ${gapFooterToContact}px;">
          ${formData.company_name ? `<div class="company-name">${formData.company_name}</div>` : ''}

          <div class="contact-row">
            ${formData.company_address ? `<div class="contact-item"><span class="icon">📍</span><span>${formData.company_address}</span></div>` : ''}
            ${formData.company_phone ? `<div class="contact-item"><span class="icon">📞</span><span class="phone-number">${formData.company_phone}</span></div>` : ''}
            ${formData.company_email ? `<div class="contact-item"><span class="icon">📧</span><span>${formData.company_email}</span></div>` : ''}
          </div>
        </div>

        <!-- 4. Footer / Marketing Section -->
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
