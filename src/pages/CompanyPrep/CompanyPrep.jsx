import { useState } from 'react';
import { Building2, Search, Target, Users, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const COMPANIES = [
  { name: 'Google', color: 'blue', roles: ['SDE', 'AI/ML', 'Frontend'], difficulty: 'Hard' },
  { name: 'Amazon', color: 'orange', roles: ['SDE', 'AWS Cloud', 'Backend'], difficulty: 'Hard' },
  { name: 'Microsoft', color: 'blue', roles: ['SDE', 'Full Stack', 'Azure'], difficulty: 'Medium-Hard' },
  { name: 'Meta', color: 'blue', roles: ['Frontend', 'Backend', 'Data'], difficulty: 'Hard' },
  { name: 'TCS', color: 'purple', roles: ['System Engineer', 'Digital'], difficulty: 'Medium' },
  { name: 'Infosys', color: 'blue', roles: ['Specialist Programmer', 'SE'], difficulty: 'Medium' },
];

const CompanyPrep = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = COMPANIES.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Company-Specific Preparation</h1>
        <p className="text-gray-400">Tailor your interview practice to specific company patterns and formats (Phase 7).</p>
      </header>

      {/* Search & Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 pl-12 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company, i) => (
          <div key={i} className="glass-panel p-6 flex flex-col group hover:-translate-y-1 transition-transform cursor-pointer">
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-xl bg-${company.color}-500/20 flex items-center justify-center`}>
                <Building2 className={`w-6 h-6 text-${company.color}-400`} />
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-white/10 rounded-full text-gray-300">
                {company.difficulty}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-white mb-2">{company.name}</h3>
            
            <div className="flex flex-wrap gap-2 mb-6 mt-auto">
              {company.roles.map((role, idx) => (
                <span key={idx} className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">
                  {role}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2">
              <Link to="/coding" className="flex items-center justify-center gap-2 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg text-sm transition-colors font-medium">
                <Target className="w-4 h-4" /> Technical
              </Link>
              <Link to="/voice-interview" className="flex items-center justify-center gap-2 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-sm transition-colors font-medium">
                <Users className="w-4 h-4" /> Behavioral
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Behavioral & Resume Phase Overview */}
      <div className="mt-12 grid md:grid-cols-2 gap-8">
        <div className="glass-panel p-8 border-t-2 border-purple-500">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <Users className="w-6 h-6 text-purple-400" />
            Behavioral Mock (Phase 5)
          </h2>
          <p className="text-gray-400 mb-6">
            Practice answering leadership principles and STAR method questions. AI evaluates your communication, confidence, and storytelling.
          </p>
          <ul className="space-y-3 mb-6 text-sm text-gray-300">
            <li>• "Tell me about yourself."</li>
            <li>• "Describe a challenging bug you fixed."</li>
            <li>• "Explain a conflict within your team."</li>
          </ul>
          <Link to="/voice-interview" className="btn-secondary w-full text-purple-400 border-purple-500/30 hover:bg-purple-500/10 block text-center">Start Behavioral Interview</Link>
        </div>

        <div className="glass-panel p-8 border-t-2 border-orange-500">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-orange-400" />
            Resume-Based (Phase 6)
          </h2>
          <p className="text-gray-400 mb-6">
            AI scans your resume projects (e.g., Chat app, E-commerce) and asks deep-dive architecture and design questions.
          </p>
          <ul className="space-y-3 mb-6 text-sm text-gray-300">
            <li>• "Explain your chat architecture."</li>
            <li>• "Why did you choose WebSockets?"</li>
            <li>• "If you scaled to 1M users, what changes?"</li>
          </ul>
          <Link to="/resume" className="btn-secondary w-full text-orange-400 border-orange-500/30 hover:bg-orange-500/10 block text-center">Start Resume Drill</Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyPrep;
