import { JobPostFormData } from "../../constants/jobTemplates";

export function generateTemplate6Html({ formData }: { formData: JobPostFormData }): string {
  if (!formData) return '<h1>Loading...</h1>';

  // Dark background with satin soft colors
  const backgroundColor = '#121220';      // Dark navy background
  const primaryColor = '#FF9AA2';         // Soft pastel pink
  const secondaryColor = '#B5EAEA';       // Light pastel aqua
  const textColor = '#E1E1E6';            // Soft off-white text
  const fontFamily = "'Poppins', sans-serif";

  // Calculate counts and scaling
  const mainJobCount = formData.job_title ? 1 : 0;
  const additionalJobCount = formData.additional_jobs?.length || 0;
  const totalJobs = mainJobCount + additionalJobCount;
  const scaleFactor =
    totalJobs <= 1 ? 1 : totalJobs >= 6 ? 0.6 : 1 - (totalJobs - 1) * 0.08;

  // Scaled font sizes
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
        padding: 0; box-sizing: border-box;
      }
      @media print {
        html, body {
          background-color: ${backgroundColor} !important;
          color: ${textColor} !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .container {
          background-color: ${backgroundColor} !important;
          box-shadow: none !important;
          page-break-inside: avoid !important;
        }
        .we-are-hiring {
          color: ${textColor} !important;
          page-break-inside: avoid !important;
        }
        .we-are {
          color: ${primaryColor} !important;
        }
        .job-item {
          background-color: ${secondaryColor}33 !important;
          border-color: ${primaryColor} !important;
          color: ${textColor} !important;
          page-break-inside: avoid !important;
        }
        .company-section {
          background-color: ${secondaryColor}22 !important;
          border-color: ${secondaryColor} !important;
          page-break-inside: avoid !important;
          color: ${textColor} !important;
        }
        .app-section {
          background-color: ${secondaryColor} !important;
          color: #FFFFFF !important;
          page-break-inside: avoid !important;
          page-break-before: avoid !important;
          page-break-after: avoid !important;
          box-shadow: none !important;
        }
        .main-content, .job-positions-section, .contact-row {
          page-break-inside: avoid !important;
        }
        * {
          text-shadow: none !important;
          filter: none !important;
          background-color: transparent !important;
        }
      }
      html, body {
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
      .container {
        width: 210mm; 
        min-height: 297mm; 
        max-height: auto;
        background: #181824;
        position: relative;
        display: flex; flex-direction: column;
        box-shadow: 0 0 20px rgba(181, 234, 234, 0.5);
        padding: 40px 50px;
        justify-content: space-between;
        height: 95vh;
        border-radius: 15px;
      }
      .megaphone-icon {
        position: absolute; top: 30px; left: 40px;
        width: 200px; height: 150px; z-index: 10;
        filter: drop-shadow(0 0 0.3rem ${primaryColor});
      }
      .megaphone-icon img {
        width: 100%; height: 100%; object-fit: contain;
      }
      .header-section {
        text-align: center; margin-bottom: ${marginHeader}px;
      }
      .we-are-hiring {
        font-family: ${fontFamily}; font-weight: 900; font-size: 70px;
        color: ${primaryColor};
        text-transform: uppercase; letter-spacing: 6px; line-height: 1;
        margin-bottom: 0;
      }
      .we-are-hiring .we-are {
        color: ${secondaryColor};
      }
      .we-are-hiring .title {
        font-size: 30px; font-weight: 700;
        margin-top: 15px;
        color: ${textColor};
        max-width: 600px; margin-left: auto; margin-right: auto;
        line-height: 1.4;
      }
      .job-positions-section {
        margin-bottom: ${marginJobSection}px;
      }
      .section-title {
        font-size: 28px; font-weight: 800; color: ${primaryColor};
        text-transform: uppercase; margin-bottom: 23px;
        letter-spacing: 3px; border-bottom: 4px solid ${primaryColor};
        padding-bottom: 12px; display: inline-block;
      }
      .job-item {
        background-color: ${secondaryColor}22;
        border: 2px solid ${primaryColor};
        border-radius: 12px;
        padding: ${25 * scaleFactor}px ${30 * scaleFactor}px;
        margin-bottom: ${gapBetweenJobs}px;
        text-align: left; color: ${textColor};
        position: relative;
        box-shadow: 0 0 6px ${secondaryColor}99;
      }
      .job-item::before {
        content: "•";
        font-size: ${jobTitleFontSize}px; font-weight: 900;
        color: ${primaryColor};
        position: absolute; left: 15px; top: 50%;
        transform: translateY(-50%);
      }
      .job-title {
        font-size: ${jobTitleFontSize}px; font-weight: 900; color: ${textColor};
        text-transform: uppercase; margin-left: 40px;
        margin-bottom: ${12 * scaleFactor}px; letter-spacing: 3px; line-height: 1.2;
      }
      .nos {
        font-size: ${nosFontSize}px; text-transform: lowercase;
        margin-left: 8px; color: ${secondaryColor}; font-weight: 700;
      }
      .job-requirements {
        font-size: ${jobReqFontSize}px; font-weight: 500; color: ${textColor};
        line-height: 1.8; opacity: 0.9; margin-left: 40px; max-width: 70%;
      }
      .company-section {
        background-color: ${secondaryColor}22; /* Soft pastel pink (light) */
        border-top: 3px solid #FF9AA2; /* primary pastel pink */
        border-bottom: 3px solid #FF9AA2;
        padding: ${20 * scaleFactor}px 0;
        margin-bottom: ${gapFooterToContact}px;
        min-height: ${contactHeight}px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: ${20 * scaleFactor}px;
        color: ${textColor};
        border-radius: 12px;
        }
    .company-name {
        font-size: ${companyNameFontSize}px; font-weight: 900;
        color: ${primaryColor};
        text-transform: uppercase; margin-bottom: ${20 * scaleFactor}px;
        letter-spacing: 4px;
      }
      .contact-row {
        display: flex; align-items: center; justify-content: center;
        gap: ${30 * scaleFactor}px; flex-wrap: wrap; width: 100%; max-width: 700px;
      }
      .contact-item {
        display: flex; align-items: center; gap: ${10 * scaleFactor}px;
        font-size: ${contactFontSize}px; font-weight: 600;
        min-width: 220px; justify-content: center; text-align: center;
        white-space: nowrap; color: ${textColor};
      }
      .icon {
        font-size: ${22 * scaleFactor}px;
      }
      .phone-number {
        font-size: ${phoneFontSize}px; font-weight: 900; color: ${primaryColor};
      }
      .app-section {
        background-color: ${secondaryColor}22;
        border-radius: 15px;
        padding: ${18 * scaleFactor}px ${25 * scaleFactor}px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${20 * scaleFactor}px;
        flex-wrap: wrap;
        font-size: ${footerFontSize}px;
        color: ${textColor};
        box-shadow: 0 0 15px ${primaryColor}88;
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
        box-shadow: 0 0 8px ${secondaryColor}bb;
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
        letter-spacing: 3px;
        color: ${textColor};
      }
      .app-right {
        display: flex;
        gap: ${12 * scaleFactor}px;
      }
      .store-badge {
        display: flex;
        align-items: center;
        gap: ${8 * scaleFactor}px;
        background: ${primaryColor}44;
        padding: ${10 * scaleFactor}px ${15 * scaleFactor}px;
        border-radius: 10px;
        border: 1px solid ${primaryColor}aa;
        box-shadow: 0 0 8px ${primaryColor}77;
      }
      .store-icon {
        width: ${28 * scaleFactor}px;
        height: ${28 * scaleFactor}px;
        background: ${secondaryColor};
        border-radius: 7px;
        padding: ${4 * scaleFactor}px;
        box-shadow: 0 0 6px ${secondaryColor}88;
      }
      .store-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: none;
      }
      .store-text {
        font-weight: 700;
        color: ${textColor};
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
        <div class="header-section we-are-hiring">
          <span class="we-are">WE ARE</span><br>HIRING!
          <div class="title">${formData.title}</div>
        </div>
        <div class="job-positions-section">
          <div class="section-title">JOB POSITION :</div>
          ${formData.job_title ? `<div class="job-item">
            <div class="job-title">${formData.job_title}<span> - (${formData.vacancy})</span><span class="nos">nos</span></div>
            <div class="job-requirements">${formData.experience ? `Experience: ${formData.experience}` : ''}</div>
          </div>` : ''}
          ${formData.additional_jobs && formData.additional_jobs.length > 0 ? formData.additional_jobs.map(job => `<div class="job-item" style="margin-top: ${gapBetweenJobs}px; padding-left: 12px;">
            <div class="job-title">${job.job_title}<span> - (${job.vacancy})</span><span class="nos">nos</span></div>
            <div class="job-requirements">${job.experience ? `Experience: ${job.experience}` : ''}</div>
          </div>`).join('') : ''}
        </div>
        <div class="company-section" style="min-height: ${contactHeight}px; margin-bottom: ${gapFooterToContact}px;">
          ${formData.company_name ? `<div class="company-name">${formData.company_name}</div>` : ''}
          <div class="contact-row">
            ${formData.company_address ? `<div class="contact-item"><span class="icon">📍</span><span>${formData.company_address}</span></div>` : ''}
            ${formData.company_phone ? `<div class="contact-item"><span class="icon">📞</span><span class="phone-number">${formData.company_phone}</span></div>` : ''}
            ${formData.company_email ? `<div class="contact-item"><span class="icon">📧</span><span>${formData.company_email}</span></div>` : ''}
          </div>
        </div>
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
