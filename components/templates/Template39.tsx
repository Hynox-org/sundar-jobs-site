import { JobPostFormData } from "@/constants/jobTemplates";

export function generateTemplate39Html({ formData }: { formData: JobPostFormData }): string {
  if (!formData) return '<h1>Loading...</h1>';

  // Vibrant Coral-Teal Color Scheme
  const primaryColor = '#EC4899'; // Pink & Green Primary
  const secondaryColor = '#22C55E'; // Pink & Green Secondary
  const accentColor = '#FDE047';
  const darkColor = '#831843';
  const lightColor = '#FDF2F8';
  const pinkColor = '#86EFAC';
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
  const sectionPadding = Math.max(25, 40 - (totalJobs - 1) * 2.5);
  const jobGap = Math.max(10, 16 - (totalJobs - 1) * 1.2);
  const cardPadding = Math.max(16, 24 - (totalJobs - 1) * 1.5);

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
        background: ${lightColor};
        position: relative;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        display: flex;
        flex-direction: column;
      }

      /* Colorful Top Section */
      .top-section {
        background: linear-gradient(135deg, ${primaryColor} 0%, ${pinkColor} 100%);
        padding: ${sectionPadding + 5}px ${sectionPadding + 15}px;
        position: relative;
        overflow: hidden;
        flex-shrink: 0;
      }

      /* Animated waves background */
      .wave-bg {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 80px;
        opacity: 0.3;
      }

      .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 100"><path fill="%23ffffff" d="M0,50 Q300,0 600,50 T1200,50 L1200,100 L0,100 Z"/></svg>') repeat-x;
        background-size: 1200px 100px;
      }

      /* Floating circles */
      .float-circle {
        position: absolute;
        border-radius: 50%;
        background: rgba(255,255,255,0.2);
      }

      .circle-1 {
        width: ${(100 * scaleFactor).toFixed(2)}px;
        height: ${(100 * scaleFactor).toFixed(2)}px;
        top: ${(20 * scaleFactor).toFixed(2)}px;
        right: ${(50 * scaleFactor).toFixed(2)}px;
      }

      .circle-2 {
        width: ${(60 * scaleFactor).toFixed(2)}px;
        height: ${(60 * scaleFactor).toFixed(2)}px;
        top: ${(80 * scaleFactor).toFixed(2)}px;
        right: ${(200 * scaleFactor).toFixed(2)}px;
      }

      .circle-3 {
        width: ${(80 * scaleFactor).toFixed(2)}px;
        height: ${(80 * scaleFactor).toFixed(2)}px;
        bottom: ${(30 * scaleFactor).toFixed(2)}px;
        left: ${(100 * scaleFactor).toFixed(2)}px;
      }

      .top-content {
        position: relative;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: ${(30 * scaleFactor).toFixed(2)}px;
      }

      .top-left {
        flex: 1;
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: ${(8 * scaleFactor).toFixed(2)}px;
        background: ${accentColor};
        color: ${darkColor};
        padding: ${(8 * scaleFactor).toFixed(2)}px ${(18 * scaleFactor).toFixed(2)}px;
        border-radius: 30px;
        font-size: ${(11 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: ${(20 * scaleFactor).toFixed(2)}px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .status-pill::before {
        content: '✨';
        font-size: ${(14 * scaleFactor).toFixed(2)}px;
      }

      .main-title {
        font-size: ${(70 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: white;
        line-height: 0.95;
        text-transform: uppercase;
        letter-spacing: -2px;
        margin-bottom: ${(15 * scaleFactor).toFixed(2)}px;
        text-shadow: 0 4px 12px rgba(0,0,0,0.2);
      }

      .main-title .highlight-word {
        color: ${accentColor};
      }

      .subtitle-text {
        font-size: ${(17 * scaleFactor).toFixed(2)}px;
        color: white;
        font-weight: 600;
        line-height: 1.5;
        max-width: ${(450 * scaleFactor).toFixed(2)}px;
      }

      .top-right {
        background: white;
        padding: ${(22 * scaleFactor).toFixed(2)}px;
        border-radius: ${(20 * scaleFactor).toFixed(2)}px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        text-align: center;
        min-width: ${(180 * scaleFactor).toFixed(2)}px;
      }

      .company-logo-circle {
        width: ${(70 * scaleFactor).toFixed(2)}px;
        height: ${(70 * scaleFactor).toFixed(2)}px;
        background: ${secondaryColor};
        border-radius: 50%;
        margin: 0 auto ${(15 * scaleFactor).toFixed(2)}px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(78,205,196,0.4);
      }

      .company-logo-circle img {
        width: 65%;
        height: 65%;
        object-fit: contain;
      }

      .company-name-top {
        font-size: ${(30 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${primaryColor};
        text-transform: uppercase;
        line-height: 1.2;
        text-align: center;
        padding: ${(10 * scaleFactor).toFixed(2)}px;
      }

      /* Main Content Area */
      .content-area {
        flex: 1;
        padding: ${sectionPadding}px ${sectionPadding + 15}px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }

      .section-heading {
        display: inline-flex;
        align-items: center;
        gap: ${(10 * scaleFactor).toFixed(2)}px;
        background: ${darkColor};
        color: white;
        padding: ${(12 * scaleFactor).toFixed(2)}px ${(22 * scaleFactor).toFixed(2)}px;
        border-radius: 30px;
        font-size: ${(16 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        margin-bottom: ${(30 * scaleFactor).toFixed(2)}px;
        box-shadow: 0 4px 12px rgba(45,49,66,0.3);
      }

      .section-heading::before {
        content: '💼';
        font-size: ${(20 * scaleFactor).toFixed(2)}px;
      }

      /* Zigzag Job Cards */
      .jobs-zigzag {
        display: flex;
        flex-direction: column;
        gap: ${jobGap}px;
        margin-bottom: ${(25 * scaleFactor).toFixed(2)}px;
      }

      .job-row {
        display: flex;
        align-items: stretch;
        gap: ${(15 * scaleFactor).toFixed(2)}px;
      }

      .job-row:nth-child(odd) {
        padding-left: 0;
        padding-right: ${(40 * scaleFactor).toFixed(2)}px;
      }

      .job-row:nth-child(even) {
        padding-left: ${(40 * scaleFactor).toFixed(2)}px;
        padding-right: 0;
        flex-direction: row-reverse;
      }

      .job-number {
        flex-shrink: 0;
        width: ${(50 * scaleFactor).toFixed(2)}px;
        height: ${(50 * scaleFactor).toFixed(2)}px;
        background: linear-gradient(135deg, ${secondaryColor} 0%, #5FE8DF 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: ${(22 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: white;
        box-shadow: 0 4px 12px rgba(78,205,196,0.4);
      }

      .job-row:nth-child(even) .job-number {
        background: linear-gradient(135deg, ${primaryColor} 0%, #FF8E8E 100%);
        box-shadow: 0 4px 12px rgba(255,107,107,0.4);
      }

      .job-row:nth-child(3n) .job-number {
        background: linear-gradient(135deg, ${accentColor} 0%, #FFE99B 100%);
        box-shadow: 0 4px 12px rgba(255,230,109,0.4);
        color: ${darkColor};
      }

      .job-card-zig {
        flex: 1;
        background: white;
        border-radius: ${(16 * scaleFactor).toFixed(2)}px;
        padding: ${cardPadding}px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border: 3px solid transparent;
        transition: all 0.3s ease;
        position: relative;
      }

      .job-card-zig:hover {
        border-color: ${secondaryColor};
        transform: translateY(-3px);
        box-shadow: 0 8px 20px rgba(78,205,196,0.3);
      }

      .job-row:nth-child(even) .job-card-zig:hover {
        border-color: ${primaryColor};
        box-shadow: 0 8px 20px rgba(255,107,107,0.3);
      }

      .job-title-zig {
        font-size: ${(24 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${darkColor};
        margin-bottom: ${(10 * scaleFactor).toFixed(2)}px;
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: 12px;
      }

      .vacancy-tag {
        background: ${secondaryColor};
        color: white;
        padding: ${(5 * scaleFactor).toFixed(2)}px ${(12 * scaleFactor).toFixed(2)}px;
        border-radius: 20px;
        font-size: ${(12 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        white-space: nowrap;
      }

      .job-row:nth-child(even) .vacancy-tag {
        background: ${primaryColor};
      }

      .job-row:nth-child(3n) .vacancy-tag {
        background: ${accentColor};
        color: ${darkColor};
      }

      .job-desc {
        font-size: ${(14 * scaleFactor).toFixed(2)}px;
        color: #6B7280;
        font-weight: 500;
        line-height: 1.6;
      }

      .job-desc strong {
        color: ${darkColor};
        font-weight: 700;
      }

      /* Contact Bar */
      .contact-bar {
        background: ${darkColor};
        border-radius: ${(16 * scaleFactor).toFixed(2)}px;
        padding: ${(25 * scaleFactor).toFixed(2)}px;
        margin-top: auto;
        position: relative;
        overflow: hidden;
      }

      .contact-bar::before {
        content: '';
        position: absolute;
        top: -50%;
        right: -20%;
        width: ${(300 * scaleFactor).toFixed(2)}px;
        height: ${(300 * scaleFactor).toFixed(2)}px;
        background: radial-gradient(circle, ${primaryColor}20 0%, transparent 70%);
        border-radius: 50%;
      }

      .contact-bar::after {
        content: '';
        position: absolute;
        bottom: -50%;
        left: -10%;
        width: ${(250 * scaleFactor).toFixed(2)}px;
        height: ${(250 * scaleFactor).toFixed(2)}px;
        background: radial-gradient(circle, ${secondaryColor}20 0%, transparent 70%);
        border-radius: 50%;
      }

      .contact-content {
        position: relative;
        z-index: 2;
        display: flex;
        justify-content: space-around;
        align-items: center;
        gap: ${(20 * scaleFactor).toFixed(2)}px;
        flex-wrap: wrap;
      }

      .contact-item-bar {
        text-align: center;
        flex: 1;
        min-width: ${(150 * scaleFactor).toFixed(2)}px;
      }

      .contact-icon-large {
        width: ${(50 * scaleFactor).toFixed(2)}px;
        height: ${(50 * scaleFactor).toFixed(2)}px;
        background: linear-gradient(135deg, ${secondaryColor} 0%, #5FE8DF 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto ${(12 * scaleFactor).toFixed(2)}px;
        font-size: ${(24 * scaleFactor).toFixed(2)}px;
        box-shadow: 0 4px 12px rgba(78,205,196,0.4);
      }

      .contact-item-bar:nth-child(2) .contact-icon-large {
        background: linear-gradient(135deg, ${accentColor} 0%, #FFE99B 100%);
        box-shadow: 0 4px 12px rgba(255,230,109,0.4);
      }

      .contact-item-bar:nth-child(3) .contact-icon-large {
        background: linear-gradient(135deg, ${primaryColor} 0%, #FF8E8E 100%);
        box-shadow: 0 4px 12px rgba(255,107,107,0.4);
      }

      .contact-label-bar {
        font-size: ${(10 * scaleFactor).toFixed(2)}px;
        color: ${accentColor};
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: 800;
        margin-bottom: ${(6 * scaleFactor).toFixed(2)}px;
      }

      .contact-data {
        font-size: ${(14 * scaleFactor).toFixed(2)}px;
        color: white;
        font-weight: 700;
        line-height: 1.4;
        word-break: break-word;
      }

      .contact-data.phone-big {
        font-size: ${(18 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${secondaryColor};
      }

      /* Bottom Footer */
      .bottom-footer {
        background: white;
        padding: ${(20 * scaleFactor).toFixed(2)}px ${sectionPadding + 15}px;
        border-top: 4px solid ${primaryColor};
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }

      .footer-app {
        display: flex;
        align-items: center;
        gap: ${(12 * scaleFactor).toFixed(2)}px;
      }

      .app-logo-footer {
        width: ${(45 * scaleFactor).toFixed(2)}px;
        height: ${(45 * scaleFactor).toFixed(2)}px;
        background: white;
        border-radius: ${(10 * scaleFactor).toFixed(2)}px;
        padding: ${(8 * scaleFactor).toFixed(2)}px;
      }

      .app-logo-footer img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .app-info-footer {
        color: ${darkColor};
      }

      .app-name-footer {
        font-size: ${(18 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .app-tagline-footer {
        font-size: ${(11 * scaleFactor).toFixed(2)}px;
        color: #6B7280;
        font-weight: 600;
      }

      .footer-buttons {
        display: flex;
        gap: ${(10 * scaleFactor).toFixed(2)}px;
      }

      .footer-download-btn {
        background: ${darkColor};
        padding: ${(10 * scaleFactor).toFixed(2)}px ${(16 * scaleFactor).toFixed(2)}px;
        border-radius: ${(10 * scaleFactor).toFixed(2)}px;
        display: flex;
        align-items: center;
        gap: ${(8 * scaleFactor).toFixed(2)}px;
      }

      .btn-icon-footer {
        width: ${(20 * scaleFactor).toFixed(2)}px;
        height: ${(20 * scaleFactor).toFixed(2)}px;
      }

      .btn-icon-footer img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .btn-text-footer {
        color: white;
        font-size: ${(12 * scaleFactor).toFixed(2)}px;
        font-weight: 800;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Top Colorful Section -->
      <div class="top-section">
        <div class="wave-bg">
          <div class="wave"></div>
        </div>
        <div class="float-circle circle-1"></div>
        <div class="float-circle circle-2"></div>
        <div class="float-circle circle-3"></div>

        <div class="top-content">
          <div class="top-left">
            <div class="status-pill">We're Hiring!</div>
            <h1 class="main-title">
              <span class="highlight-word">AMAZING</span><br>
              CAREERS AWAIT
            </h1>
            ${formData.title ? `<p class="subtitle-text">${formData.title}</p>` : ''}
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="content-area">
        <div class="section-heading">Open Positions</div>

        <!-- Zigzag Job Cards -->
        <div class="jobs-zigzag">
          ${formData.job_title ? `
          <div class="job-row">
            <div class="job-number">1</div>
            <div class="job-card-zig">
              <div class="job-title-zig">
                <span>${formData.job_title}</span>
                <div class="vacancy-tag">${formData.vacancy} ${formData.vacancy > 1 ? 'Spots' : 'Spot'}</div>
              </div>
              ${formData.experience ? `<div class="job-desc"><strong>Experience:</strong> ${formData.experience} years required</div>` : ''}
            </div>
          </div>` : ''}

          ${formData.additional_jobs && formData.additional_jobs.length > 0 ? formData.additional_jobs.map((job, index) => `
          <div class="job-row">
            <div class="job-number">${index + 2}</div>
            <div class="job-card-zig">
              <div class="job-title-zig">
                <span>${job.job_title}</span>
                <div class="vacancy-tag">${job.vacancy} ${job.vacancy > 1 ? 'Spots' : 'Spot'}</div>
              </div>
              ${job.experience ? `<div class="job-desc"><strong>Experience:</strong> ${job.experience} years required</div>` : ''}
            </div>
          </div>`).join('') : ''}
        </div>

        <!-- Contact Bar -->
        <div class="contact-bar">
        ${formData.company_name ? `<div class="company-name-top">${formData.company_name}</div>` : ''}
          <div class="contact-content">
            ${formData.company_phone ? `
            <div class="contact-item-bar">
              <div class="contact-icon-large">📞</div>
              <div class="contact-label-bar">Call Us</div>
              <div class="contact-data phone-big">${formData.company_phone}</div>
            </div>` : ''}

            ${formData.company_email ? `
            <div class="contact-item-bar">
              <div class="contact-icon-large">✉️</div>
              <div class="contact-label-bar">Email</div>
              <div class="contact-data">${formData.company_email}</div>
            </div>` : ''}

            ${formData.company_address ? `
            <div class="contact-item-bar">
              <div class="contact-label-bar">Visit</div>
              <div class="contact-data">${formData.company_address}</div>
            </div>` : ''}
          </div>
        </div>
      </div>

      <!-- Bottom Footer -->
      <div class="bottom-footer">
        <div class="footer-app">
          <div class="app-logo-footer">
            <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/logo.png" alt="SundarJobs" />
          </div>
          <div class="app-info-footer">
            <div class="app-name-footer">SundarJobs</div>
            <div class="app-tagline-footer">Find Your Dream Job</div>
          </div>
        </div>

        <div class="footer-buttons">
          <div class="footer-download-btn">
            <div class="btn-icon-footer">
              <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/playstore-icon.png" alt="Android" />
            </div>
            <div class="btn-text-footer">Android</div>
          </div>
          <div class="footer-download-btn">
            <div class="btn-icon-footer">
              <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/appstore-icon.png" alt="iOS" />
            </div>
            <div class="btn-text-footer">iOS</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}
