import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Settings, Target, ChevronRight, Code2, Brain, Database, Server, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  { id: 'dsa', name: 'Data Structures & Algorithms', icon: Code2 },
  { id: 'sysdesign', name: 'System Design', icon: Server },
  { id: 'oop', name: 'Object-Oriented Programming', icon: Brain },
  { id: 'dbms', name: 'Database Management', icon: Database },
  { id: 'os', name: 'Operating Systems', icon: Settings },
  { id: 'networks', name: 'Computer Networks', icon: Compass },
];

const LANGUAGES = [
  'Java', 'Python', 'C++', 'C', 'JavaScript', 'TypeScript', 'C#', 'PHP', 'Kotlin', 'Swift', 'Dart'
];

const QUESTION_POOL = [
  { 
    category: 'Data Structures & Algorithms', question: 'Design a data structure that supports insert, delete, search, and getRandom in O(1) time complexity.', difficulty: 'Hard', 
    exampleInput: '["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]\n[[], [1], [2], [2], [], [1], [2], []]',
    exampleOutput: '[null, true, false, true, 2, true, false, 2]',
    explanation: 'RandomizedSet handles inserts and removes in O(1). getRandom returns a random element.'
  },
  { 
    category: 'Data Structures & Algorithms', question: 'Implement an LRU Cache. It should support get and put operations in O(1) average time complexity.', difficulty: 'Medium', 
    exampleInput: '["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]',
    exampleOutput: '[null, null, null, 1, null, -1, null, -1, 3, 4]',
    explanation: 'LRUCache evicts the least recently used item when capacity is exceeded.'
  },
  { 
    category: 'Data Structures & Algorithms', question: 'Design an algorithm to serialize and deserialize a binary tree.', difficulty: 'Hard', 
    exampleInput: 'root = [1,2,3,null,null,4,5]',
    exampleOutput: '[1,2,3,null,null,4,5]',
    explanation: 'The tree is serialized into a string and deserialized back into a tree structure.'
  },
  { 
    category: 'Data Structures & Algorithms', question: 'Merge k Sorted Lists. You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.', difficulty: 'Hard', 
    exampleInput: 'lists = [[1,4,5],[1,3,4],[2,6]]',
    exampleOutput: '[1,1,2,3,4,4,5,6]',
    explanation: 'The linked-lists are merged into one sorted linked-list.'
  },
  { 
    category: 'Data Structures & Algorithms', question: 'Implement a Trie (Prefix Tree) with insert, search, and startsWith methods.', difficulty: 'Medium', 
    exampleInput: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]',
    exampleOutput: '[null, null, true, false, true, null, true]',
    explanation: 'Trie stores prefixes and complete words efficiently.'
  },
  { 
    category: 'System Design', question: 'Design a URL shortener like bit.ly. Focus on the hashing algorithm and collision resolution.', difficulty: 'Medium', 
    exampleInput: 'url = "https://leetcode.com/problems/design-tinyurl"',
    exampleOutput: '"http://bit.ly/4e9iSw"',
    explanation: 'The original URL is hashed into a shorter string which can be decoded back.'
  },
  { 
    category: 'System Design', question: 'Design a rate limiter for an API gateway. Implement the logic for a Token Bucket algorithm.', difficulty: 'Hard', 
    exampleInput: 'requests = [1, 1, 1, 1], limit = 3 requests / sec',
    exampleOutput: '[true, true, true, false]',
    explanation: 'The 4th request within the same second is dropped due to the rate limit.'
  },
  { 
    category: 'System Design', question: 'Design an in-memory key-value store with TTL (Time To Live) support.', difficulty: 'Medium', 
    exampleInput: 'set("a", 1, 100), get("a") instantly, get("a") after 200ms',
    exampleOutput: '1, -1',
    explanation: 'The key expires after 100ms, making subsequent gets return -1.'
  },
  { 
    category: 'Object-Oriented Programming', question: 'Implement a thread-safe Singleton pattern in your preferred language.', difficulty: 'Medium', 
    exampleInput: 'db1 = DatabaseConnection.getInstance(), db2 = DatabaseConnection.getInstance()',
    exampleOutput: 'true',
    explanation: 'Both variables hold the exact same instance reference in memory (db1 === db2).'
  },
  { 
    category: 'Data Structures & Algorithms', question: 'How do you find the longest palindromic substring in a given string in O(n) time?', difficulty: 'Hard', 
    exampleInput: 's = "babad"',
    exampleOutput: '"bab"',
    explanation: '"bab" is a valid palindrome substring of length 3.'
  },
  { 
    category: 'Data Structures & Algorithms', question: 'Write a program to solve a Sudoku puzzle by filling the empty cells.', difficulty: 'Hard', 
    exampleInput: 'board = [["5","3",".",".","7",".",".",".","."], ...]',
    exampleOutput: '[["5","3","4","6","7","8","9","1","2"], ...]',
    explanation: 'Empty cells are filled with digits 1-9 obeying Sudoku rules via backtracking.'
  },
  { 
    category: 'Data Structures & Algorithms', question: 'Find the median of two sorted arrays of different sizes in O(log(min(m,n))) time.', difficulty: 'Hard', 
    exampleInput: 'nums1 = [1,2], nums2 = [3,4]',
    exampleOutput: '2.5',
    explanation: 'Merged array = [1,2,3,4], median = (2 + 3) / 2 = 2.5'
  }
];

const Interviews = () => {
  const [step, setStep] = useState(() => {
    return Number(sessionStorage.getItem('interviewStep')) || 1;
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState(() => {
    const saved = sessionStorage.getItem('interviewQuestions');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    sessionStorage.setItem('interviewStep', step);
  }, [step]);

  useEffect(() => {
    if (questions) {
      sessionStorage.setItem('interviewQuestions', JSON.stringify(questions));
    } else {
      sessionStorage.removeItem('interviewQuestions');
    }
  }, [questions]);

  // Form State
  const [config, setConfig] = useState({
    experienceLevel: 'intermediate',
    targetCompany: '',
    difficulty: 'medium',
    categories: [],
    languages: []
  });

  const toggleCategory = (id) => {
    setConfig(prev => ({
      ...prev,
      categories: prev.categories.includes(id) 
        ? prev.categories.filter(c => c !== id)
        : [...prev.categories, id]
    }));
  };

  const toggleLanguage = (lang) => {
    setConfig(prev => ({
      ...prev,
      languages: prev.languages.includes(lang) 
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const generateRandomQuestions = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      const shuffled = [...QUESTION_POOL].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3).map((q, idx) => ({ ...q, id: Date.now() + idx }));
      setQuestions(selected);
      setStep(2);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Technical Interview Setup</h1>
        <p className="text-gray-400">Configure your mock interview. Our AI will generate tailored questions based on your selections.</p>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div 
            key="config"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-6">
              {/* Core Settings */}
              <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Interview Parameters
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Experience Level</label>
                    <select 
                      value={config.experienceLevel}
                      onChange={(e) => setConfig({...config, experienceLevel: e.target.value})}
                      className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="entry">Entry Level (0-2 years)</option>
                      <option value="intermediate">Intermediate (3-5 years)</option>
                      <option value="senior">Senior (5+ years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
                    <select 
                      value={config.difficulty}
                      onChange={(e) => setConfig({...config, difficulty: e.target.value})}
                      className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-2">Target Company (Optional)</label>
                    <input 
                      type="text"
                      placeholder="e.g. Google, Meta, Amazon..."
                      value={config.targetCompany}
                      onChange={(e) => setConfig({...config, targetCompany: e.target.value})}
                      className="w-full bg-white/5 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Topics & Categories
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CATEGORIES.map(category => {
                    const isSelected = config.categories.includes(category.id);
                    const Icon = category.icon;
                    return (
                      <div 
                        key={category.id}
                        onClick={() => toggleCategory(category.id)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                          isSelected 
                            ? 'bg-purple-500/20 border-purple-500/50 text-white' 
                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-purple-400' : ''}`} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Programming Languages */}
              <div className="glass-panel p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-green-400" />
                  Languages
                </h2>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map(lang => {
                    const isSelected = config.languages.includes(lang);
                    return (
                      <button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                          isSelected 
                            ? 'bg-green-500/20 border-green-500/50 text-green-300' 
                            : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {lang}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Summary & Generate */}
              <div className="glass-panel p-6 bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-blue-500/30">
                <h3 className="font-bold text-white mb-4">Ready to begin?</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Our AI will analyze your selections (and your uploaded resume if available) to generate a customized technical interview session.
                </p>
                <button 
                  onClick={generateRandomQuestions}
                  disabled={isGenerating || (config.categories.length === 0 && config.languages.length === 0)}
                  className="w-full btn-primary py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/20"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Generating Questions...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Interview
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="questions"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Your Mock Interview</h2>
                <p className="text-gray-400">Questions generated for {config.targetCompany || 'General Tech'} • {config.experienceLevel} level</p>
              </div>
              <button onClick={() => { setStep(1); setQuestions(null); }} className="btn-secondary text-sm">
                New Configuration
              </button>
            </div>

            <div className="grid gap-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="glass-panel p-6 group transition-all hover:bg-white/5">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-bold border border-purple-500/20">
                      {q.category}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      q.difficulty === 'Hard' ? 'bg-red-500/20 text-red-300 border-red-500/20' :
                      q.difficulty === 'Medium' ? 'bg-orange-500/20 text-orange-300 border-orange-500/20' :
                      'bg-green-500/20 text-green-300 border-green-500/20'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="text-2xl font-bold text-gray-700 mt-1">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-white mb-4 leading-relaxed">
                        {q.question}
                      </h3>
                      
                      <div className="flex gap-3 mt-4">
                        <Link 
                          to="/coding" 
                          state={{ 
                            preferredLanguage: config.languages[0] || 'JavaScript',
                            questionDetails: q,
                            generateAiOnLoad: true
                          }}
                          className="btn-primary py-2 px-6 flex items-center gap-2"
                        >
                          <Brain className="w-4 h-4" />
                          Answer with AI
                        </Link>
                        <Link 
                          to="/coding" 
                          state={{ 
                            preferredLanguage: config.languages[0],
                            questionDetails: q
                          }}
                          className="btn-secondary py-2 px-6 flex items-center gap-2"
                        >
                          <Code2 className="w-4 h-4" />
                          Code Editor
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-center mt-8 gap-4">
              <button onClick={() => { setStep(1); setQuestions(null); }} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium border border-white/10 flex items-center gap-2">
                Configure New
              </button>
              <button 
                onClick={generateRandomQuestions} 
                disabled={isGenerating}
                className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-xl transition-colors font-medium border border-blue-500/30 flex items-center gap-2"
              >
                {isGenerating ? <Sparkles className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {isGenerating ? 'Generating...' : 'Generate More Questions'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Interviews;
