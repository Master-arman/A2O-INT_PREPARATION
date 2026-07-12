import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Sparkles, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [targetRole, setTargetRole] = useState('Frontend Developer');

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
    }
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    // Simulate AI analysis delay
    setTimeout(() => {
      setIsAnalyzing(false);

      const fileName = file ? file.name.toLowerCase() : '';
      const fileSize = file ? file.size : 1;
      
      // Deterministic score based on file size and name length
      let atsScore = 60 + (fileSize % 25) + (fileName.length % 15);
      if (atsScore > 98) atsScore = 98; // Cap at 98
      
      let missingKeywords = [];
      let strengths = ['Clear formatting', 'Good action verbs'];
      let weaknesses = ['Lack of quantifiable metrics in experience'];

      if (targetRole.includes('Frontend')) {
        missingKeywords = ['Redux / Zustand', 'Webpack / Vite', 'Accessibility (a11y)'];
        if (!fileName.includes('react') && !fileName.includes('frontend')) weaknesses.push('Resume title doesn\'t strongly highlight frontend');
        else strengths.push('Strong focus on frontend UI/UX in projects');
      } else if (targetRole.includes('Full Stack')) {
        missingKeywords = ['Docker', 'System Design', 'Redis / Caching', 'CI/CD Pipeline'];
        if (!fileName.includes('full') && !fileName.includes('stack')) weaknesses.push('Missing database optimization metrics');
        else strengths.push('Good balance of frontend and backend skills');
      } else {
        missingKeywords = ['Microservices', 'Kubernetes', 'Distributed Systems'];
        strengths.push('Strong problem-solving and algorithmic indicators');
      }

      setResults({
        atsScore,
        missingKeywords,
        strengths,
        weaknesses
      });
    }, 2500);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">AI Resume Reviewer</h1>
        <p className="text-gray-400">Upload your resume to get instant ATS scoring, keyword analysis, and personalized feedback.</p>
      </header>

      {!results ? (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-8">
            <h2 className="text-xl font-bold text-white mb-6">Upload Resume (PDF)</h2>
            
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-700 hover:border-blue-500 bg-gray-800/30 rounded-2xl p-10 text-center transition-colors cursor-pointer group"
            >
              <div className="w-16 h-16 bg-blue-500/10 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
              </div>
              <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
              <p className="text-gray-500 text-sm mb-6">PDF files only, max 5MB</p>
              
              <input type="file" id="resume" className="hidden" accept=".pdf" onChange={(e) => setFile(e.target.files[0])} />
              <label htmlFor="resume" className="btn-secondary inline-block">Select File</label>
            </div>

            {file && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 text-red-400 rounded-lg">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{file.name}</p>
                    <p className="text-gray-500 text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button onClick={() => setFile(null)} className="text-gray-500 hover:text-red-400">
                  <AlertCircle className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            <button 
              onClick={handleAnalyze} 
              disabled={!file || isAnalyzing}
              className="w-full mt-6 btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-white mb-4">Target Role & Job Description</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Target Job Role</label>
                  <select 
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option>Frontend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>Software Development Engineer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Job Description (Optional)</label>
                  <textarea 
                    rows={4}
                    placeholder="Paste the job description here for highly targeted feedback..."
                    className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6 bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/20 text-blue-400 rounded-xl mt-1">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1">Why use AI Review?</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    Over 75% of resumes are rejected by ATS systems before a human sees them. Our AI checks your formatting, keywords, and impact metrics against real job descriptions to maximize your chances.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Analysis Results</h2>
            <button onClick={() => setResults(null)} className="btn-secondary text-sm">Upload New Resume</button>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent" />
              <div className="relative z-10 w-32 h-32 mb-4 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="60" fill="transparent" stroke="#1e293b" strokeWidth="8" />
                  <circle cx="64" cy="64" r="60" fill="transparent" stroke="#22c55e" strokeWidth="8" strokeDasharray="377" strokeDashoffset={377 - (377 * results.atsScore) / 100} className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-4xl font-bold text-white">{results.atsScore}</span>
                  <span className="text-xs text-gray-400">/ 100</span>
                </div>
              </div>
              <h3 className="font-bold text-white text-lg relative z-10">ATS Compatibility</h3>
              <p className="text-green-400 text-sm relative z-10 mt-1">Great! You are in the top 20%</p>
            </div>

            <div className="md:col-span-2 glass-panel p-6">
              <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-blue-400" />
                Missing Keywords
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {results.missingKeywords.map((kw, i) => (
                  <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-medium">
                    {kw}
                  </span>
                ))}
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    Strengths
                  </h4>
                  <ul className="space-y-2">
                    {results.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5">•</span> {s}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-400" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-2">
                    {results.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className="text-orange-400 mt-0.5">•</span> {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ResumeUpload;
