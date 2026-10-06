// High-quality 1-Page PDF Generator for Skills Cheat Sheets & Interview Reports

export const generateSkillPdf = (skillData, topicData) => {
  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (!printWindow) {
    alert('Please allow popups to download your 1-page PDF cheat sheet.');
    return;
  }

  const skillName = skillData?.name || 'Programming Skill';
  const skillColor = skillData?.color || '#ffa116';
  const topicTitle = topicData?.title || 'Core Fundamentals';
  const topicSummary = topicData?.summary || 'Essential concepts, algorithmic patterns, and best practices.';
  const codeSnippet = topicData?.codeExample || '// Code sample not available';
  const takeaways = topicData?.keyTakeaways || [
    'Write clean, modular code with predictable time & space complexity.',
    'Test edge cases: empty bounds, negative values, null/undefined inputs.',
    'Follow modern idiomatic conventions for the language.'
  ];
  const interviewTips = topicData?.aiDeepDive ? topicData.aiDeepDive.replace(/[*#]/g, '').slice(0, 300) : 'Focus on time/space trade-offs and clarify ambiguity before implementing.';

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${skillName} - ${topicTitle} (1-Page Cheat Sheet)</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      line-height: 1.35;
      font-size: 11px;
    }
    .page-container {
      width: 100%;
      max-height: 275mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid ${skillColor};
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .title-group h1 {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .title-group p {
      font-size: 10px;
      color: #64748b;
      margin-top: 1px;
    }
    .badge {
      background: ${skillColor}20;
      color: #0f172a;
      border: 1px solid ${skillColor};
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 8px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px;
      background: #f8fafc;
    }
    .card-title {
      font-size: 11px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 4px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .code-box {
      background: #0f172a;
      color: #38bdf8;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 9.5px;
      padding: 8px;
      border-radius: 6px;
      line-height: 1.35;
      overflow: hidden;
      white-space: pre-wrap;
      border: 1px solid #334155;
      margin-bottom: 8px;
    }
    ul {
      list-style-type: none;
    }
    li {
      margin-bottom: 3px;
      position: relative;
      padding-left: 10px;
      font-size: 10px;
      color: #334155;
    }
    li::before {
      content: "•";
      color: ${skillColor};
      font-weight: bold;
      position: absolute;
      left: 0;
    }
    .tip-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 6px;
      padding: 6px 8px;
      font-size: 10px;
      color: #92400e;
      margin-bottom: 6px;
    }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 4px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 9px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="page-container">
    <div>
      <div class="header">
        <div class="title-group">
          <h1>${skillName} 1-Page Cheat Sheet</h1>
          <p>Topic: <strong>${topicTitle}</strong> | TechPrep Master Interview Kit</p>
        </div>
        <div class="badge">${skillName}</div>
      </div>

      <div class="card" style="margin-bottom: 8px;">
        <div class="card-title">📌 Executive Overview & Core Concept</div>
        <p style="font-size: 10.5px; color: #334155;">${topicSummary}</p>
      </div>

      <div style="margin-bottom: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
          <span style="font-size: 10.5px; font-weight: 700; color: #0f172a;">⚡ Verified Code Pattern & Reference:</span>
          <span style="font-size: 9px; color: #64748b; font-family: monospace;">A4 Optimized</span>
        </div>
        <pre class="code-box">${escapeHtml(codeSnippet)}</pre>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-title">🎯 Key Takeaways & Best Practices</div>
          <ul>
            ${takeaways.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
          </ul>
        </div>

        <div class="card">
          <div class="card-title">💡 FAANG Interview Edge & Traps</div>
          <p style="font-size: 9.5px; color: #475569; line-height: 1.35;">${escapeHtml(interviewTips)}</p>
        </div>
      </div>

      <div class="tip-box">
        <strong>⚡ Performance Rule:</strong> Aim for optimal Time (O(N) or O(log N)) and Space complexity. Always clarify input edge constraints before coding!
      </div>
    </div>

    <div class="footer">
      <span>TechPrep AI Platform &copy; ${new Date().getFullYear()}</span>
      <span>Skill: ${skillName} | ${topicTitle}</span>
      <span>Page 1 of 1 (Single Page PDF)</span>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

export const generateInterviewReportPdf = (feedbackData) => {
  const printWindow = window.open('', '_blank', 'width=850,height=1100');
  if (!printWindow) {
    alert('Please allow popups to download your 1-page PDF report.');
    return;
  }

  const overallScore = feedbackData?.overallScore || 84;
  const verdict = feedbackData?.readinessVerdict || 'Strong Hire';
  const summary = feedbackData?.summary || 'Demonstrated strong structured problem solving and technical communication.';
  const metrics = feedbackData?.metrics || { technical: 85, problemSolving: 88, communication: 80, confidence: 82, codeStructure: 85 };
  const strengths = feedbackData?.strengths || ['Clear complexity analysis', 'Clean modular design'];
  const improvements = feedbackData?.improvements || ['Proactively probe constraints', 'Pace state transitions'];

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>A2O Interview Evaluation Report (1-Page PDF)</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 8mm 10mm 8mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.35;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #00b8a3;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .score-banner {
      background: #f0fdfa;
      border: 1px solid #5eead4;
      border-radius: 8px;
      padding: 10px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .score-num {
      font-size: 26px;
      font-weight: 900;
      color: #0f766e;
    }
    .verdict-tag {
      background: #0d9488;
      color: #ffffff;
      padding: 4px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
    }
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 10px;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      background: #f8fafc;
    }
    .card-title {
      font-size: 11px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 3px;
    }
    .metric-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      font-size: 10px;
    }
    .bar-wrap {
      width: 50%;
      background: #e2e8f0;
      height: 6px;
      border-radius: 4px;
      overflow: hidden;
    }
    .bar-fill {
      background: #0d9488;
      height: 100%;
    }
    ul { list-style: none; }
    li {
      margin-bottom: 4px;
      position: relative;
      padding-left: 10px;
      font-size: 10px;
      color: #334155;
    }
    li.good::before { content: "✓"; color: #0d9488; font-weight: bold; position: absolute; left: 0; }
    li.warn::before { content: "▲"; color: #d97706; font-size: 8px; position: absolute; left: 0; top: 1px; }
    .footer {
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 style="font-size: 18px; font-weight: 800; color: #0f172a;">A2O Mock Interview Performance Report</h1>
      <p style="font-size: 10px; color: #64748b;">AI Behavioral & Technical Evaluation</p>
    </div>
    <div style="text-align: right; font-size: 10px; color: #64748b;">
      Date: ${new Date().toLocaleDateString()}
    </div>
  </div>

  <div class="score-banner">
    <div>
      <p style="font-size: 10px; text-transform: uppercase; font-weight: 700; color: #64748b;">Overall Preparedness Score</p>
      <span class="score-num">${overallScore}</span><span style="font-size: 14px; color: #64748b;"> / 100</span>
    </div>
    <div class="verdict-tag">${verdict}</div>
  </div>

  <div class="card" style="margin-bottom: 10px;">
    <div class="card-title">Executive Summary</div>
    <p style="font-size: 10.5px; color: #334155;">${escapeHtml(summary)}</p>
  </div>

  <div class="grid-2">
    <div class="card">
      <div class="card-title">Performance Competencies</div>
      <div class="metric-row">
        <span>Technical Knowledge</span>
        <div class="bar-wrap"><div class="bar-fill" style="width: ${metrics.technical || 80}%"></div></div>
        <span style="font-weight: 700;">${metrics.technical || 80}%</span>
      </div>
      <div class="metric-row">
        <span>Problem Solving</span>
        <div class="bar-wrap"><div class="bar-fill" style="width: ${metrics.problemSolving || 85}%"></div></div>
        <span style="font-weight: 700;">${metrics.problemSolving || 85}%</span>
      </div>
      <div class="metric-row">
        <span>Communication Clarity</span>
        <div class="bar-wrap"><div class="bar-fill" style="width: ${metrics.communication || 75}%"></div></div>
        <span style="font-weight: 700;">${metrics.communication || 75}%</span>
      </div>
      <div class="metric-row">
        <span>Confidence & Composure</span>
        <div class="bar-wrap"><div class="bar-fill" style="width: ${metrics.confidence || 80}%"></div></div>
        <span style="font-weight: 700;">${metrics.confidence || 80}%</span>
      </div>
      <div class="metric-row">
        <span>Code Structure / Quality</span>
        <div class="bar-wrap"><div class="bar-fill" style="width: ${metrics.codeStructure || 85}%"></div></div>
        <span style="font-weight: 700;">${metrics.codeStructure || 85}%</span>
      </div>
    </div>

    <div class="card">
      <div class="card-title">Key Strengths</div>
      <ul>
        ${strengths.map(s => `<li class="good">${escapeHtml(s)}</li>`).join('')}
      </ul>
      <div class="card-title" style="margin-top: 6px;">Actionable Improvements</div>
      <ul>
        ${improvements.map(i => `<li class="warn">${escapeHtml(i)}</li>`).join('')}
      </ul>
    </div>
  </div>

  <div class="footer">
    <span>A2O TechPrep Interview Preparation Platform</span>
    <span>Candidate Evaluation Report</span>
    <span>Page 1 of 1</span>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 250);
    };
  </script>
</body>
</html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};

function escapeHtml(text) {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
