import { motion } from 'framer-motion';
import { Target, MessageCircle, Code2, BrainCircuit, ShieldCheck, ChevronRight } from 'lucide-react';

const ScoreBar = ({ label, score, icon: Icon, color }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-2">
      <span className="flex items-center gap-2 text-sm font-medium text-gray-300">
        <Icon className={`w-4 h-4 text-${color}-400`} />
        {label}
      </span>
      <span className={`font-bold text-${color}-400`}>{score}/100</span>
    </div>
    <div className="w-full bg-gray-800 rounded-full h-2">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`bg-${color}-500 h-2 rounded-full`}
      />
    </div>
  </div>
);

const InterviewFeedback = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-8">
      <header className="text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-blue-500 rounded-full mx-auto flex items-center justify-center mb-4 shadow-lg shadow-green-500/20">
          <ShieldCheck className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Interview Completed!</h1>
        <p className="text-gray-400">Here is your comprehensive AI evaluation and feedback.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 mt-8">
        {/* Scores */}
        <div className="glass-panel p-6">
          <h2 className="text-xl font-bold text-white mb-6">Performance Metrics (Phase 8)</h2>
          
          <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Overall Readiness</p>
              <h3 className="text-3xl font-bold text-white">82%</h3>
            </div>
            <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg font-bold border border-green-500/20">
              Strong Hire
            </div>
          </div>

          <ScoreBar label="Technical Knowledge" score={85} icon={Code2} color="blue" />
          <ScoreBar label="Problem Solving" score={90} icon={Target} color="green" />
          <ScoreBar label="Communication" score={75} icon={MessageCircle} color="orange" />
          <ScoreBar label="Confidence" score={80} icon={BrainCircuit} color="purple" />
          <ScoreBar label="Coding Quality" score={88} icon={Code2} color="blue" />
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-6">
          <div className="glass-panel p-6 border-l-4 border-l-green-500">
            <h3 className="font-bold text-white mb-3">Strengths</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-green-400">•</span> Exceptional optimization of the Two Sum algorithm using a Map.</li>
              <li className="flex gap-2"><span className="text-green-400">•</span> Clearly explained the time and space complexity tradeoffs.</li>
              <li className="flex gap-2"><span className="text-green-400">•</span> Demonstrated strong understanding of SOLID principles in the behavioral round.</li>
            </ul>
          </div>

          <div className="glass-panel p-6 border-l-4 border-l-orange-500">
            <h3 className="font-bold text-white mb-3">Areas to Improve</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex gap-2"><span className="text-orange-400">•</span> Could improve variable naming (e.g., using 'complements' instead of 'map').</li>
              <li className="flex gap-2"><span className="text-orange-400">•</span> Pacing was slightly fast during the system design explanation. Slow down.</li>
              <li className="flex gap-2"><span className="text-orange-400">•</span> Missed mentioning edge cases like empty inputs before writing code.</li>
            </ul>
          </div>

          <div className="glass-panel p-6 bg-white/5 border border-white/10">
            <h3 className="font-bold text-white mb-4">Suggested Next Topics</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-sm border border-blue-500/20">Dynamic Programming</span>
              <span className="px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg text-sm border border-purple-500/20">System Design (Databases)</span>
              <span className="px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-lg text-sm border border-orange-500/20">STAR Method Practice</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center mt-8">
        <button className="btn-primary py-3 px-8 flex items-center gap-2">
          View Analytics Dashboard
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default InterviewFeedback;
