import { JobPostFormData } from "@/constants/jobTemplates";

export function generateTemplate6Html({ formData }: { formData: JobPostFormData }): string {
  if (!formData) return '<h1>Loading...</h1>';

  // Modern vibrant color scheme
  const primaryColor = '#E63946';
  const secondaryColor = '#1D3557';
  const accentColor = '#457B9D';
  const darkColor = '#1A1A2E';
  const lightColor = '#F1FAEE';
  const fontFamily = "'Inter', sans-serif";

  // Calculate scaling with more aggressive reduction
  const mainJobCount = formData.job_title ? 1 : 0;
  const additionalJobCount = formData.additional_jobs?.length || 0;
  const totalJobs = mainJobCount + additionalJobCount;

  // More aggressive scaling factors
  const scaleFactor = totalJobs <= 1 ? 1.1 :
    totalJobs === 2 ? 1.05 :
      totalJobs === 3 ? 1.02 :
        totalJobs === 4 ? 1.01 :
          totalJobs === 5 ? 1.00 :
            totalJobs === 6 ? 0.95 :
              totalJobs >= 7 ? 0.75 : 0.80;

  // Dynamic spacing based on job count
  const heroHeight = Math.max(180, 280 - (totalJobs - 1) * 20);
  const mainPadding = Math.max(25, 50 - (totalJobs - 1) * 4);
  const sectionGap = Math.max(18, 40 - (totalJobs - 1) * 3);
  const jobGap = Math.max(10, 18 - (totalJobs - 1) * 1.5);
  const contactPadding = Math.max(20, 35 - (totalJobs - 1) * 2.5);
  const contactHeaderPadding = Math.max(18, 28 - (totalJobs - 1) * 1.5);
  const contactCardPadding = Math.max(14, 24 - (totalJobs - 1) * 1.5);
  const contactGap = Math.max(15, 30 - (totalJobs - 1) * 2);
  const ctaPadding = Math.max(12, 20 - (totalJobs - 1) * 1.2);
  const ctaMarginTop = Math.max(12, 25 - (totalJobs - 1) * 2);
  const footerPadding = Math.max(18, 25 - (totalJobs - 1) * 1);

  // Hero section scaling
  const heroTitleSize = Math.max(42, 72 - (totalJobs - 1) * 5);
  const heroSubtitleSize = Math.max(14, 20 - (totalJobs - 1) * 1);
  const badgeSize = Math.max(10, 13 - (totalJobs - 1) * 0.5);
  const megaphoneSize = Math.max(100, 160 - (totalJobs - 1) * 10);

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
        -webkit-user-select: none;
        user-select: none;
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

      /* Hero Section */
      .hero-section {
        background: linear-gradient(135deg, ${secondaryColor} 0%, #003366 100%);
        height: ${heroHeight}px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 ${mainPadding + 20}px;
        overflow: hidden;
        flex-shrink: 0;
      }

      /* Decorative Background Elements */
      .bg-decoration {
        position: absolute;
        border-radius: 50%;
        opacity: 0.1;
      }

      .bg-circle-1 {
        width: ${300 * scaleFactor}px;
        height: ${300 * scaleFactor}px;
        background: white;
        top: ${-150 * scaleFactor}px;
        right: ${-75 * scaleFactor}px;
      }

      .bg-circle-2 {
        width: ${250 * scaleFactor}px;
        height: ${250 * scaleFactor}px;
        background: ${primaryColor};
        bottom: ${-125 * scaleFactor}px;
        left: ${-60 * scaleFactor}px;
      }

      .megaphone-wrapper {
        position: absolute;
        top: 50%;
        right: ${mainPadding + 10}px;
        transform: translateY(-50%);
        width: ${megaphoneSize}px;
        height: ${megaphoneSize}px;
      }

      .megaphone-glow {
        position: absolute;
        inset: 0;
        background: radial-gradient(circle, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 30%, transparent 60%);
        border-radius: 50%;
        animation: pulse 3s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.1); opacity: 1; }
      }

      .megaphone-wrapper img {
        position: relative;
        width: 100%;
        height: 100%;
        object-fit: contain;
        filter: brightness(0) invert(1);
        z-index: 2;
      }

      .hero-content {
        position: relative;
        z-index: 10;
        max-width: ${450 * scaleFactor}px;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        gap: ${6 * scaleFactor}px;
        background: ${primaryColor};
        color: white;
        padding: ${8 * scaleFactor}px ${16 * scaleFactor}px;
        border-radius: ${25 * scaleFactor}px;
        font-size: ${badgeSize}px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: ${1.2 * scaleFactor}px;
        margin-bottom: ${20 * scaleFactor}px;
      }

      .badge::before {
        content: '●';
        animation: blink 2s ease-in-out infinite;
      }

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.3; }
      }

      .hero-title {
        font-size: ${heroTitleSize}px;
        font-weight: 900;
        color: white;
        line-height: 0.95;
        text-transform: uppercase;
        letter-spacing: ${-1.5 * scaleFactor}px;
        margin-bottom: ${12 * scaleFactor}px;
      }

      .hero-title .highlight {
        color: ${primaryColor};
      }

      .hero-subtitle {
        font-size: ${heroSubtitleSize}px;
        font-weight: 500;
        color: rgba(255,255,255,0.9);
        line-height: 1.4;
      }

      /* Main Content */
      .main-content {
        padding: ${mainPadding}px ${mainPadding + 20}px ${mainPadding - 10}px;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .section-label {
        display: inline-block;
        background: ${lightColor};
        color: ${secondaryColor};
        padding: ${6 * scaleFactor}px ${14 * scaleFactor}px;
        border-radius: ${5 * scaleFactor}px;
        font-size: ${(11 * scaleFactor).toFixed(2)}px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: ${1.2 * scaleFactor}px;
        margin-bottom: ${(25 * scaleFactor).toFixed(2)}px;
        border-left: ${3 * scaleFactor}px solid ${primaryColor};
      }

      /* Job Cards Grid */
      .jobs-container {
        display: grid;
        gap: ${jobGap}px;
        margin-bottom: ${sectionGap}px;
      }

      .job-card {
        background: white;
        border: ${1.5 * scaleFactor}px solid #E8E8E8;
        border-radius: ${12 * scaleFactor}px;
        padding: ${(20 * scaleFactor).toFixed(2)}px ${(26 * scaleFactor).toFixed(2)}px;
        position: relative;
        transition: all 0.3s ease;
        overflow: hidden;
      }

      .job-card::before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: ${5 * scaleFactor}px;
        background: linear-gradient(180deg, ${primaryColor} 0%, ${accentColor} 100%);
        transition: width 0.3s ease;
      }

      .job-card:hover::before {
        width: ${8 * scaleFactor}px;
      }

      .job-card:nth-child(even)::before {
        background: linear-gradient(180deg, ${secondaryColor} 0%, #0066AA 100%);
      }

      .job-top {
        display: flex;
        justify-content: space-between;
        align-items: start;
        gap: ${12 * scaleFactor}px;
        margin-bottom: ${(10 * scaleFactor).toFixed(2)}px;
      }

      .job-name {
        font-size: ${(24 * scaleFactor).toFixed(2)}px;
        font-weight: 800;
        color: ${darkColor};
        line-height: 1.25;
        flex: 1;
      }

      .positions-badge {
        background: ${primaryColor};
        color: white;
        padding: ${(6 * scaleFactor).toFixed(2)}px ${(14 * scaleFactor).toFixed(2)}px;
        border-radius: ${(20 * scaleFactor).toFixed(2)}px;
        font-size: ${(13 * scaleFactor).toFixed(2)}px;
        font-weight: 800;
        white-space: nowrap;
        box-shadow: 0 ${3 * scaleFactor}px ${10 * scaleFactor}px rgba(255,107,53,0.3);
      }

      .job-card:nth-child(even) .positions-badge {
        background: ${secondaryColor};
        box-shadow: 0 ${3 * scaleFactor}px ${10 * scaleFactor}px rgba(0,78,137,0.3);
      }

      .job-detail {
        font-size: ${(14 * scaleFactor).toFixed(2)}px;
        color: #666;
        font-weight: 500;
        line-height: 1.5;
      }

      .job-detail strong {
        color: ${darkColor};
        font-weight: 700;
      }

      /* Contact Section - Dynamically Scaled */
      .contact-section {
        background: ${darkColor};
        border-radius: ${(16 * scaleFactor).toFixed(2)}px;
        padding: 0;
        margin-bottom: ${(20 * scaleFactor).toFixed(2)}px;
        overflow: hidden;
        position: relative;
        flex-shrink: 0;
      }

      .contact-header {
        background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
        padding: ${contactHeaderPadding}px ${(32 * scaleFactor).toFixed(2)}px;
        text-align: center;
        position: relative;
      }

      .contact-header::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: ${150 * scaleFactor}px;
        height: 100%;
        background: radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%);
      }

      .company-title {
        font-size: ${(38 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: white;
        text-transform: uppercase;
        letter-spacing: ${1.5 * scaleFactor}px;
        position: relative;
        z-index: 2;
      }

      .contact-body {
        padding: ${contactPadding}px ${(32 * scaleFactor).toFixed(2)}px;
        background: ${darkColor};
      }

      .contact-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(${150 * scaleFactor}px, 1fr));
        gap: ${contactGap}px;
      }

      .contact-card {
        background: rgba(255,255,255,0.05);
        border: ${1.5 * scaleFactor}px solid rgba(255,255,255,0.1);
        border-radius: ${(12 * scaleFactor).toFixed(2)}px;
        padding: ${contactCardPadding}px;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
      }

      .contact-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: ${3 * scaleFactor}px;
        background: ${primaryColor};
        transform: scaleX(0);
        transition: transform 0.3s ease;
      }

      .contact-card:hover {
        background: rgba(255,255,255,0.08);
        border-color: rgba(255,255,255,0.2);
        transform: translateY(-2px);
      }

      .contact-card:hover::before {
        transform: scaleX(1);
      }

      .contact-card:nth-child(2)::before {
        background: ${accentColor};
      }

      .contact-card:nth-child(3)::before {
        background: ${secondaryColor};
      }

      .contact-icon-wrapper {
        width: ${(50 * scaleFactor).toFixed(2)}px;
        height: ${(50 * scaleFactor).toFixed(2)}px;
        background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto ${(14 * scaleFactor).toFixed(2)}px;
        font-size: ${(24 * scaleFactor).toFixed(2)}px;
        box-shadow: 0 ${(6 * scaleFactor).toFixed(2)}px ${(16 * scaleFactor).toFixed(2)}px rgba(255,107,53,0.3);
      }

      .contact-card:nth-child(2) .contact-icon-wrapper {
        background: linear-gradient(135deg, ${accentColor} 0%, #FFB84D 100%);
        box-shadow: 0 ${(6 * scaleFactor).toFixed(2)}px ${(16 * scaleFactor).toFixed(2)}px rgba(247,147,30,0.3);
      }

      .contact-card:nth-child(3) .contact-icon-wrapper {
        background: linear-gradient(135deg, ${secondaryColor} 0%, #0066AA 100%);
        box-shadow: 0 ${(6 * scaleFactor).toFixed(2)}px ${(16 * scaleFactor).toFixed(2)}px rgba(0,78,137,0.3);
      }

      .contact-label {
        font-size: ${(10 * scaleFactor).toFixed(2)}px;
        color: rgba(255,255,255,0.6);
        text-transform: uppercase;
        letter-spacing: ${1 * scaleFactor}px;
        font-weight: 700;
        margin-bottom: ${(8 * scaleFactor).toFixed(2)}px;
      }

      .contact-text {
        font-size: ${(14 * scaleFactor).toFixed(2)}px;
        color: white;
        font-weight: 700;
        line-height: 1.4;
        word-break: break-word;
      }

      .contact-text.phone {
        font-size: ${(18 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        color: ${primaryColor};
        letter-spacing: 0.5px;
      }

      .apply-cta {
        background: linear-gradient(135deg, ${primaryColor} 0%, ${accentColor} 100%);
        color: white;
        text-align: center;
        padding: ${ctaPadding}px;
        margin-top: ${ctaMarginTop}px;
        border-radius: ${(10 * scaleFactor).toFixed(2)}px;
        font-size: ${(14 * scaleFactor).toFixed(2)}px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: ${0.8 * scaleFactor}px;
      }

      /* Footer */
      .footer {
        background: ${darkColor};
        padding: ${footerPadding}px ${mainPadding + 20}px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
      }

      .app-brand {
        display: flex;
        align-items: center;
        gap: ${(14 * scaleFactor).toFixed(2)}px;
      }

      .app-icon {
        width: ${(42 * scaleFactor).toFixed(2)}px;
        height: ${(42 * scaleFactor).toFixed(2)}px;
        background: white;
        border-radius: ${(10 * scaleFactor).toFixed(2)}px;
        padding: ${(6 * scaleFactor).toFixed(2)}px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .app-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .app-details {
        color: white;
      }

      .app-title {
        font-size: ${(17 * scaleFactor).toFixed(2)}px;
        font-weight: 900;
        text-transform: uppercase;
        letter-spacing: ${0.8 * scaleFactor}px;
        margin-bottom: 2px;
      }

      .app-slogan {
        font-size: ${(10 * scaleFactor).toFixed(2)}px;
        opacity: 0.7;
        font-weight: 500;
      }

      .download-buttons {
        display: flex;
        gap: ${(12 * scaleFactor).toFixed(2)}px;
      }

      .download-btn {
        background: rgba(255,255,255,0.1);
        border: ${1.2 * scaleFactor}px solid rgba(255,255,255,0.3);
        padding: ${(10 * scaleFactor).toFixed(2)}px ${(16 * scaleFactor).toFixed(2)}px;
        border-radius: ${(8 * scaleFactor).toFixed(2)}px;
        display: flex;
        align-items: center;
        gap: ${(8 * scaleFactor).toFixed(2)}px;
        transition: all 0.3s ease;
      }

      .download-btn:hover {
        background: rgba(255,255,255,0.2);
        border-color: rgba(255,255,255,0.5);
      }

      .btn-icon {
        width: ${(20 * scaleFactor).toFixed(2)}px;
        height: ${(20 * scaleFactor).toFixed(2)}px;
      }

      .btn-icon img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .btn-label {
        color: white;
        font-size: ${(12 * scaleFactor).toFixed(2)}px;
        font-weight: 700;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <!-- Hero Section -->
      <div class="hero-section">
        <div class="bg-decoration bg-circle-1"></div>
        <div class="bg-decoration bg-circle-2"></div>
        
        <div class="megaphone-wrapper">
          <div class="megaphone-glow"></div>
          <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/top-left1.png" alt="Hiring" />
        </div>

        <div class="hero-content">
          <div class="badge">NOW HIRING</div>
          <h1 class="hero-title">
            JOIN<br>
            <span class="highlight">OUR TEAM</span>
          </h1>
          ${formData.title ? `<p class="hero-subtitle">${formData.title}</p>` : ''}
        </div>
      </div>

      <!-- Main Content -->
      <div class="main-content">
        <div class="section-label">🎯 Open Positions</div>

        <div class="jobs-container">
          ${formData.job_title ? `
          <div class="job-card">
            <div class="job-top">
              <div class="job-name">${formData.job_title}</div>
              <div class="positions-badge">${formData.vacancy} ${formData.vacancy > 1 ? 'Positions' : 'Position'}</div>
            </div>
            ${formData.experience ? `<div class="job-detail"><strong>Experience:</strong> ${formData.experience} years required</div>` : ''}
          </div>` : ''}

          ${formData.additional_jobs && formData.additional_jobs.length > 0 ? formData.additional_jobs.map(job => `
          <div class="job-card">
            <div class="job-top">
              <div class="job-name">${job.job_title}</div>
              <div class="positions-badge">${job.vacancy} ${job.vacancy > 1 ? 'Positions' : 'Position'}</div>
            </div>
            ${job.experience ? `<div class="job-detail"><strong>Experience:</strong> ${job.experience} years required</div>` : ''}
          </div>`).join('') : ''}
        </div>

        <!-- Contact Section -->
        <div class="contact-section">
          <div class="contact-header">
            ${formData.company_name ? `<h2 class="company-title">${formData.company_name}</h2>` : ''}
            ${formData.company_address ? `<p class="company-address">${formData.company_address}</p>` : ''}
            ${formData.company_phone ? `<p class="company-phone">${formData.company_phone}</p>` : ''}
            ${formData.company_email ? `<p class="company-email">${formData.company_email}</p>` : ''}
          </div>
          
          ${totalJobs < 5 ? `<div class="contact-body">
          <div class="apply-cta">
              🚀 Apply Now & Start Your Career Journey
            </div>
          </div>` : ''}
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="app-brand">
          <div class="app-icon">
            <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/logo.png" alt="SundarJobs" />
          </div>
          <div class="app-details">
            <div class="app-title">SundarJobs</div>
            <div class="app-slogan">Find Your Dream Career</div>
          </div>
        </div>

        <div class="download-buttons">
          <div class="download-btn">
            <div class="btn-icon">
              <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/playstore-icon.png" alt="Play Store" />
            </div>
            <div class="btn-label">Android</div>
          </div>
          <div class="download-btn">
            <div class="btn-icon">
              <img src="https://qjplvfufjesoejmbkwaf.supabase.co/storage/v1/object/public/sundarjobs/poster-assets/appstore-icon.png" alt="App Store" />
            </div>
            <div class="btn-label">iPhone</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
  `;
}