# Software Engineering Mini Project Report
## PrepPulse – AI-Powered Interview Preparation Platform

---

### Abstract
Managing technical and behavioral interview preparation has become increasingly challenging due to the dynamic nature of job roles, industry expectations, and lack of accessible real-time mentorship. Candidates frequently struggle with unguided practice, static question sets, and absence of constructive feedback on their coding, behavioral, and communication skills. To address these challenges, this project presents **PrepPulse**, an AI-powered interview preparation web platform engineered to automate mock interview simulations, resume skill alignment, and performance evaluation.

The proposed system combines modern full-stack web technologies with state-of-the-art Large Language Models (LLMs) to create an adaptive and interactive evaluation environment. Candidates can upload their resume in PDF format, which is processed to extract key competencies and map them directly against target job profiles. The system dynamically generates context-aware technical, situational, and behavioral interview questions. Candidate responses are evaluated on precision, completeness, architectural reasoning, and communication clarity.

PrepPulse follows a robust three-tier architecture comprising a modern React-based frontend, a Node.js and Express backend, and a scalable database for user profile and session storage. Secure user authentication is enforced through JSON Web Tokens (JWT) / Supabase Auth and bcrypt password hashing. Following interview completion, the application delivers actionable visual feedback, comprehensive scoring metrics, and targeted improvement roadmaps, effectively enhancing student readiness and confidence.

---

### Introduction
In today's highly competitive recruitment landscape, candidates require both deep technical proficiency and articulate communication capabilities. However, traditional interview preparation methods largely depend on static question banks, textbook problems, and infrequent offline peer mock sessions. Such approaches fail to deliver adaptive questioning, instant performance evaluation, or objective analysis of candidate weaknesses.

Recent advancements in Natural Language Processing (NLP) and Generative Artificial Intelligence (AI) have enabled automated, intelligent systems that closely mirror human interviewers. These models understand context, assess technical accuracy, evaluate structural logic in coding tasks, and provide structured, multi-dimensional feedback. Combined with document parsing capabilities, systems can extract candidate experience from resumes to generate highly personalized interview tracks.

PrepPulse is an intelligent web application designed to bridge the gap between candidate preparation and actual industry interviews. Users select target job roles (such as Full-Stack Developer, Data Analyst, or Cloud Engineer) and experience levels to initiate tailored mock sessions. The platform provides a unified environment featuring automated question generation, integrated code execution, and comprehensive scorecards, creating an efficient and scalable solution for personal career development.

---

### Methodology
PrepPulse is developed following modular software engineering principles across five core subsystems:

1. **Frontend Architecture**: Built using React.js and modern styling to deliver a responsive, clean, and intuitive user interface across devices. It manages client routing, session states, code editing panes, and interactive dashboard charts.
2. **Secure Authentication Module**: Manages user registration, session tokens, and access control. Passwords are securely hashed with bcrypt, and protected endpoints are safeguarded via JSON Web Tokens (JWT) / Supabase Authentication.
3. **Resume Extraction & Job Mapping**: Allows users to upload resumes in PDF format. Text extraction routines parse skills, projects, and domain expertise to calibrate interview difficulty and question focus.
4. **AI Mock Interview Engine**: Integrates with modern AI/LLM APIs to stream role-specific technical and behavioral questions sequentially, analyzing submitted responses for technical accuracy, clarity, and relevance.
5. **Analytics & Feedback Pipeline**: Calculates scorecards spanning multiple dimensions including coding logic, communication, and domain knowledge, displaying historical performance trends via charts.

---

### Results
The developed PrepPulse platform delivers the following key outcomes and verified capabilities:
- **Seamless User Authentication**: Enables secure sign-up, login, password recovery, and encrypted session management.
- **Personalized Interview Generation**: Dynamically produces relevant questions based on selected role, difficulty tier, and candidate background.
- **Integrated Multi-Mode Evaluation**: Supports both text responses and coding solutions with real-time feedback.
- **Detailed Analytical Scorecards**: Provides actionable insights, granular metrics, and category-wise strength/weakness indicators.
- **Progress Tracking Dashboard**: Maintains historical session logs to monitor preparation trajectory and skill mastery over time.

---

### Conclusion & Future Enhancements
PrepPulse successfully establishes an intelligent, accessible, and automated interview preparation system that solves the core bottlenecks of static study resources and costly private coaching. By integrating AI-driven prompt evaluation with modern web technologies, the application offers an adaptive, realistic, and highly supportive learning environment.

Future enhancements include real-time speech-to-text processing for voice-driven oral interviews, facial sentiment analysis via webcam for body language feedback, and collaborative peer mock rooms. PrepPulse presents a meaningful contribution toward bridging the academic-to-industry transition for aspiring professionals.

---

### Configuration & Deployment Files

#### `index.html` (Frontend Entry Point)
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#2563eb" />
    <title>PrepPulse - AI Interview Prep</title>
    <style>
      html, body { height: 100%; margin: 0; }
      #root { height: 100%; }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

#### `render.yaml` (Cloud Deployment Specification)
```yaml
services:
  - type: web
    name: preppulse-api
    env: node
    rootDir: backend
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_VERSION
        value: 20
      - key: PORT
        value: 5000
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: AI_API_KEY
        sync: false
      - key: CORS_ORIGIN
        sync: false

  - type: web
    name: preppulse-web
    env: static
    rootDir: frontend
    buildCommand: npm install && npm run build
    staticPublishPath: dist
    envVars:
      - key: NODE_VERSION
        value: 20
      - key: VITE_API_BASE_URL
        sync: false
```

---

### List of Figures (Project Screenshots)

| Figure | Description | Module / Interface |
|---|---|---|
| **Fig 1.1** | Login Page | Supabase & Demo Auth with Tabs |
| **Fig 1.2** | Registration Role | Account Creation & OAuth Integration |
| **Fig 4.3** | Candidate Dashboard | Recent interview history, Practice Hub & readiness score |
| **Fig 4.4** | Resume Upload & Skill Parser | ATS scoring, keyword analysis & job description alignment |
| **Fig 4.5** | Active AI Mock Interview Session | Real-time coding editor, constraints & voice interviewer |
| **Fig 4.1** | Technical Interview Setup Interface | Courses, tutorials, and guided preparation roadmap |
| **Fig 4.3** | Real-Time Voice Mock Interview Session | Speech-to-text, live transcript & AI voice interviewer |
| **Fig 4.5** | Practice & Global Leaderboard Portal | Algorithmic streaks, XP badges & competitive rankings |
| **Fig 4.4** | Performance Analytics & Topic Mastery | Radar topic mastery breakdown & historical practice trends |
| **Fig 1.10** | Technical Interview Setup | Experience tier, programming languages & topic category selector |
