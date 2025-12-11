import { JobPostFormData } from "@/constants/jobTemplates";

export function generateTemplate21Html({ formData }: { formData: JobPostFormData }): string {
  if (!formData) return '<h1>Loading...</h1>';

  // Bold Green-Yellow Color Scheme
  const primaryColor = '#10B981'; // Emerald green
  const secondaryColor = '#FBBF24'; // Amber yellow
  const accentColor = '#34D399'; // Light green
  const darkColor = '#064E3B'; // Dark green
  const lightColor = '#F0FDF4';
  const textDark = '#1F2937';
  const fontFamily = "'Inter', sans-serif";

  // Calculate scaling
  const mainJobCount = formData.job_title ? 1 : 0;
  const additionalJobCount = formData.additional_jobs?.length || 0;
  const totalJobs = mainJobCount + additionalJobCount;
  
  const scaleFactor = totalJobs <= 1 ? 1 : 
                      totalJobs === 2 ? 0.94 :
                      totalJobs === 3 ? 0.86 :
                      totalJobs === 4 ? 0.78 :
                      totalJobs === 5 ? 0.70 :
                      totalJobs === 6 ? 0.63 :
                      totalJobs >= 7 ? 0.56 : 0.68;

  // Dynamic spacing
  const sectionPadding = Math.max(25, 45 - (totalJobs - 1) * 3);
  const jobGap = Math.max(12, 20 - (totalJobs - 1) * 1.5);
  const cardPadding = Math.max(18, 28 - (totalJobs - 1) * 1.8);

  return `
<!DOCTYPE html>
<html>
  <head>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

      @page {
        size: A4;
        margin: 0;
      }

      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      @media print {
        html, body, .container {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }

      html, body {
        width: 100%;
        height: 100vh;
        margin: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: ${fontFamily};
        background: #E5E5E5;
      }

      .container {
        width: 210mm;
        height: 297mm;
        background: white;
        position: relative;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
      }

      /* Top Geometric Header */
      .geometric-header {
        position: relative;
        height: ${Math.max(200, 320 - (totalJobs - 1) * 20)}px;
        background: white;
        overflow: hidden;
        flex-shrink: 0;
      }

      /* Geometric shapes */
      .shape {
        position: absolute;
      }

      .shape-1 {
        width: 0;
        height: 0;
        border-left: ${250 * scaleFactor}px solid transparent;
        border-right: ${250 * scaleFactor}px solid transparent;
        border-bottom: ${180 * scaleFactor}px solid ${primaryColor};
        top: -50px;
        left: -100px;
        transform: rotate(-15deg);
        opacity: 0.9;
      }

      .shape-2 {
        width: ${300 * scaleFactor}px;
        height: ${300 * scaleFactor}px;
        background: ${secondaryColor};
        border-radius: 50%;
        top: -120px;
        right: -80px;
        opacity: 0.85;
      }

      .shape-3 {
        width: ${200 * scaleFactor}px;
        height: ${200 * scaleFactor}px;
        background: ${accentColor};
        transform: rotate(45deg);
        bottom: -100px;
        left: 30%;
        opacity: 0.7;
      }

      .shape-4 {
        width: 0;
        height: 0;
        border-left: ${150 * scaleFactor}px solid transparent;
        border-right: ${150 * scaleFactor}px solid transparent;
        border-top: ${120 * scaleFactor}px solid ${secondaryColor};
        bottom: -30px;
        right: 15%;
        transform: rotate(25deg);
        opacity: 0.6;
      }

      /* Header Content */
      .header-content {
        position: relative;
        z-index: 10;
        padding: ${sectionPadding}px ${sectionPadding + 10}px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
      }

      .company-badge {
        display: inline-flex;
        align-items: center;
        gap: ${(10 * scaleFactor).toFixed(2)}px;
        background: ${darkColor};
        color: white;
        padding: ${(10 * scaleFactor).toFixed(2)}px ${(20 * scaleFactor).toFixed(2)}px;
        border-radius: 30px;
        font-size: ${(12 * scaleFactor).toFixed(2)}px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: ${(25 * scaleFactor).toFixed(2)}px;
        width: fit-content;
      }

      .company-badge::before {
        content: '✦';
        color: ${secondaryColor};
        font-size: ${(16 * scaleFactor).toFixed(2)}px;
      }

      .hero-heading {
        font-size: ${(82 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${textDark};
        line-height: 0.9;
        text-transform: uppercase;
        letter-spacing: -2px;
        margin-bottom: ${(15 * scaleFactor).toFixed(2)}px;
      }

      .hero-heading .line-1 {
        color: ${primaryColor};
      }

      .hero-heading .line-2 {
        color: ${darkColor};
      }

      .hero-tagline {
        font-size: ${(18 * scaleFactor).toFixed(2)}px;
        color: #6B7280;
        font-weight: 600;
        max-width: ${500 * scaleFactor}px;
        line-height: 1.5;
      }

      /* Diagonal Divider */
      .diagonal-divider {
        width: 100%;
        height: ${(40 * scaleFactor).toFixed(2)}px;
        background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
        transform: skewY(-2deg);
        margin: ${(-20 * scaleFactor).toFixed(2)}px 0;
        flex-shrink: 0;
      }

      /* Main Content */
      .content-wrapper {
        flex: 1;
        display: flex;
        padding: ${sectionPadding}px;
        gap: ${sectionPadding}px;
        overflow: hidden;
      }

      /* Jobs Section - Left 60% */
      .jobs-section {
        flex: 1.5;
        display: flex;
        flex-direction: column;
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: ${(12 * scaleFactor).toFixed(2)}px;
        margin-bottom: ${(25 * scaleFactor).toFixed(2)}px;
      }

      .section-icon {
        width: ${(50 * scaleFactor).toFixed(2)}px;
        height: ${(50 * scaleFactor).toFixed(2)}px;
        background: ${secondaryColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${(24 * scaleFactor).toFixed(2)}px;
        flex-shrink: 0;
      }

      .section-title {
        font-size: ${(22 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${textDark};
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      /* Job Cards */
      .jobs-grid {
        display: flex;
        flex-direction: column;
        gap: ${jobGap}px;
        overflow-y: auto;
      }

      .job-box {
        background: ${lightColor};
        border: 3px solid ${primaryColor};
        border-radius: 0;
        padding: ${cardPadding}px;
        position: relative;
        transition: all 0.3s ease;
      }

      .job-box::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 0;
        height: 0;
        border-top: ${(30 * scaleFactor).toFixed(2)}px solid ${secondaryColor};
        border-left: ${(30 * scaleFactor).toFixed(2)}px solid transparent;
        transition: all 0.3s ease;
      }

      .job-box:hover {
        background: white;
        transform: translateX(5px);
        box-shadow: -8px 8px 0 ${primaryColor};
      }

      .job-box:nth-child(even) {
        border-color: ${secondaryColor};
      }

      .job-box:nth-child(even):hover {
        box-shadow: -8px 8px 0 ${secondaryColor};
      }

      .job-box:nth-child(even)::before {
        border-top-color: ${primaryColor};
      }

      .job-header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 15px;
        margin-bottom: ${(12 * scaleFactor).toFixed(2)}px;
      }

      .job-position {
        font-size: ${(24 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${darkColor};
        line-height: 1.2;
        flex: 1;
        text-transform: uppercase;
      }

      .position-count {
        background: ${darkColor};
        color: ${secondaryColor};
        padding: ${(8 * scaleFactor).toFixed(2)}px ${(16 * scaleFactor).toFixed(2)}px;
        font-size: ${(14 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        white-space: nowrap;
        border-radius: 0;
      }

      .job-box:nth-child(even) .position-count {
        background: ${primaryColor};
        color: white;
      }

      .job-info {
        font-size: ${(14 * scaleFactor).toFixed(2)}px;
        color: #4B5563;
        font-weight: 600;
        line-height: 1.6;
      }

      .job-info strong {
        color: ${darkColor};
        font-weight: 800;
      }

      /* Contact Section - Right 40% */
      .contact-panel {
        flex: 1;
        background: ${darkColor};
        border-radius: 0;
        padding: ${sectionPadding}px;
        display: flex;
        flex-direction: column;
        gap: ${(25 * scaleFactor).toFixed(2)}px;
        position: relative;
        overflow: hidden;
      }

      .contact-panel::before {
        content: '';
        position: absolute;
        width: ${(200 * scaleFactor).toFixed(2)}px;
        height: ${(200 * scaleFactor).toFixed(2)}px;
        background: ${primaryColor};
        opacity: 0.1;
        border-radius: 50%;
        top: -100px;
        right: -50px;
      }

      .contact-panel-title {
        color: ${secondaryColor};
        font-size: ${(26 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 2px;
        position: relative;
        z-index: 2;
        padding-bottom: ${(15 * scaleFactor).toFixed(2)}px;
        border-bottom: 4px solid ${primaryColor};
      }

      ${formData.company_name ? `
      .company-name-box {
        background: white;
        padding: ${(20 * scaleFactor).toFixed(2)}px;
        text-align: center;
        position: relative;
        z-index: 2;
      }

      .company-name-text {
        font-size: ${(28 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${primaryColor};
        text-transform: uppercase;
        line-height: 1.2;
      }
      ` : ''}

      .contact-items {
        display: flex;
        flex-direction: column;
        gap: ${(18 * scaleFactor).toFixed(2)}px;
        position: relative;
        z-index: 2;
      }

      .contact-box {
        background: rgba(255,255,255,0.1);
        padding: ${(18 * scaleFactor).toFixed(2)}px;
        border-left: 5px solid ${secondaryColor};
      }

      .contact-box:nth-child(2) {
        border-left-color: ${primaryColor};
      }

      .contact-box:nth-child(3) {
        border-left-color: ${accentColor};
      }

      .contact-icon-box {
        font-size: ${(28 * scaleFactor).toFixed(2)}px;
        margin-bottom: ${(10 * scaleFactor).toFixed(2)}px;
      }

      .contact-label-box {
        font-size: ${(10 * scaleFactor).toFixed(2)}px;
        color: ${secondaryColor};
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: ${(8 * scaleFactor).toFixed(2)}px;
      }

      .contact-detail {
        color: white;
        font-size: ${(15 * scaleFactor).toFixed(2)}px;
        font-weight: 700;
        line-height: 1.5;
        word-break: break-word;
      }

      .contact-detail.phone {
        font-size: ${(20 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${secondaryColor};
      }

      .app-section-box {
        background: ${primaryColor};
        padding: ${(20 * scaleFactor).toFixed(2)}px;
        margin-top: auto;
        position: relative;
        z-index: 2;
      }

      .app-heading {
        color: white;
        font-size: ${(16 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        text-transform: uppercase;
        margin-bottom: ${(15 * scaleFactor).toFixed(2)}px;
        letter-spacing: 1px;
        text-align: center;
      }

      .app-badges {
        display: flex;
        gap: ${(10 * scaleFactor).toFixed(2)}px;
        justify-content: center;
      }

      .app-btn {
        background: ${darkColor};
        border: 2px solid white;
        padding: ${(10 * scaleFactor).toFixed(2)}px ${(15 * scaleFactor).toFixed(2)}px;
        display: flex;
        align-items: center;
        gap: ${(8 * scaleFactor).toFixed(2)}px;
        transition: all 0.3s ease;
      }

      .app-btn:hover {
        background: white;
      }

      .app-btn:hover .app-btn-text {
        color: ${darkColor};
      }

      .app-icon-small {
        width: ${(20 * scaleFactor).toFixed(2)}px;
        height: ${(20 * scaleFactor).toFixed(2)}px;
      }

      .app-icon-small img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .app-btn-text {
        color: white;
        font-size: ${(12 * scaleFactor).toFixed(2)}px;
        font-weight: 800;
        text-transform: uppercase;
      }

      /* Bottom Bar */
      .bottom-bar {
        background: ${secondaryColor};
        padding: ${(18 * scaleFactor).toFixed(2)}px ${sectionPadding}px;
        text-align: center;
        flex-shrink: 0;
      }

      .cta-text {
        font-size: ${(20 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${darkColor};
        text-transform: uppercase;
        letter-spacing: 2px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Geometric Header -->
      <div class="geometric-header">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
        <div class="shape shape-4"></div>

        <div class="header-content">
          <div class="company-badge">Career Opportunity</div>
          <h1 class="hero-heading">
            <div class="line-1">JOIN</div>
            <div class="line-2">OUR TEAM</div>
          </h1>
          ${formData.title ? `<p class="hero-tagline">${formData.title}</p>` : ''}
        </div>
      </div>

      <!-- Diagonal Divider -->
      <div class="diagonal-divider"></div>

      <!-- Main Content Area -->
      <div class="content-wrapper">
        <!-- Jobs Section -->
        <div class="jobs-section">
          <div class="section-header">
            <div class="section-icon">💼</div>
            <h2 class="section-title">Open Positions</h2>
          </div>

          <div class="jobs-grid">
            ${formData.job_title ? `
            <div class="job-box">
              <div class="job-header">
                <div class="job-position">${formData.job_title}</div>
                <div class="position-count">${formData.vacancy} OPEN</div>
              </div>
              ${formData.experience ? `<div class="job-info"><strong>Experience:</strong> ${formData.experience} years required</div>` : ''}
            </div>` : ''}

            ${formData.additional_jobs && formData.additional_jobs.length > 0 ? formData.additional_jobs.map(job => `
            <div class="job-box">
              <div class="job-header">
                <div class="job-position">${job.job_title}</div>
                <div class="position-count">${job.vacancy} OPEN</div>
              </div>
              ${job.experience ? `<div class="job-info"><strong>Experience:</strong> ${job.experience} years required</div>` : ''}
            </div>`).join('') : ''}
          </div>
        </div>

        <!-- Contact Panel -->
        <div class="contact-panel">
          <h3 class="contact-panel-title">Get In Touch</h3>

          ${formData.company_name ? `
          <div class="company-name-box">
            <div class="company-name-text">${formData.company_name}</div>
          </div>` : ''}

          <div class="contact-items">
            ${formData.company_phone ? `
            <div class="contact-box">
              <div class="contact-icon-box">📞</div>
              <div class="contact-label-box">Phone</div>
              <div class="contact-detail phone">${formData.company_phone}</div>
            </div>` : ''}

            ${formData.company_email ? `
            <div class="contact-box">
              <div class="contact-icon-box">✉️</div>
              <div class="contact-label-box">Email</div>
              <div class="contact-detail">${formData.company_email}</div>
            </div>` : ''}

            ${formData.company_address ? `
            <div class="contact-box">
              <div class="contact-label-box">Address</div>
              <div class="contact-detail">${formData.company_address}</div>
            </div>` : ''}
          </div>

          <div class="app-section-box">
            <div class="app-heading">Download SundarJobs</div>
            <div class="app-badges">
              <div class="app-btn">
                <div class="app-icon-small">
                  <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/playstore-icon.png" alt="Android" />
                </div>
                <div class="app-btn-text">Android</div>
              </div>
              <div class="app-btn">
                <div class="app-icon-small">
                  <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/appstore-icon.png" alt="iOS" />
                </div>
                <div class="app-btn-text">iOS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="bottom-bar">
        <div class="cta-text">🚀 Apply Today • Build Tomorrow</div>
      </div>
    </div>
  </body>
</html>
  `;
}
