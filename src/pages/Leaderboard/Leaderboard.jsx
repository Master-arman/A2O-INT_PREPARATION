import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Star, Medal, Crown, Calendar, ChevronRight, Brain, AlertTriangle, Clock, Cpu } from 'lucide-react';

const QUIZ_POOL = [
  {
    question: "Which of the following is true about a B-Tree?",
    options: ["It is a binary search tree", "All leaves are at the same level", "It can only store integers", "It does not allow duplicate keys"],
    correctIndex: 1,
    explanation: "In a B-Tree, all leaf nodes must be at the same level to maintain perfect balance."
  },
  {
    question: "What is the primary advantage of using a Bloom Filter?",
    options: ["It never produces false positives", "It guarantees 100% accuracy", "It is extremely space-efficient for set membership tests", "It allows O(1) deletion"],
    correctIndex: 2,
    explanation: "Bloom filters are probabilistic data structures that are highly space-efficient for checking set membership."
  },
  {
    question: "Which HTTP status code is most appropriate for a rate-limited API response?",
    options: ["401 Unauthorized", "403 Forbidden", "429 Too Many Requests", "503 Service Unavailable"],
    correctIndex: 2,
    explanation: "HTTP 429 Too Many Requests indicates the user has sent too many requests in a given amount of time."
  },
  {
    question: "In JavaScript, what will `console.log(typeof null)` output?",
    options: ['"null"', '"undefined"', '"object"', '"number"'],
    correctIndex: 2,
    explanation: "Due to a legacy bug in JavaScript's initial implementation, typeof null evaluates to 'object'."
  },
  {
    question: "What is the worst-case time complexity of Quicksort?",
    options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"],
    correctIndex: 2,
    explanation: "The worst-case occurs when the pivot is consistently the smallest or largest element, leading to O(N^2) complexity."
  },
  {
    question: "In System Design, what does the CAP theorem state?",
    options: ["A distributed system can deliver all 3: Consistency, Availability, and Partition Tolerance", "A distributed system can only guarantee 2 out of 3: Consistency, Availability, and Partition Tolerance", "Consistency is more important than Availability", "Partition tolerance can be ignored in modern networks"],
    correctIndex: 1,
    explanation: "CAP theorem states you can only simultaneously guarantee at most two of these three characteristics in a distributed system."
  },
  {
    question: "In React, what is the primary purpose of the `useMemo` hook?",
    options: ["To memoize expensive function calculations", "To memoize DOM nodes", "To trigger re-renders", "To handle side effects"],
    correctIndex: 0,
    explanation: "useMemo is used to cache the result of an expensive computation between renders."
  },
  {
    question: "Which data structure is primarily used to optimally implement an LRU Cache?",
    options: ["Array + Hash Map", "Doubly Linked List + Hash Map", "Min Heap + Array", "Binary Search Tree"],
    correctIndex: 1,
    explanation: "A Hash Map provides O(1) access, while a Doubly Linked List allows O(1) removals and additions to track recency."
  },
  {
    question: "What is the time complexity of searching an element in a perfectly balanced Binary Search Tree?",
    options: ["O(1)", "O(N)", "O(N log N)", "O(log N)"],
    correctIndex: 3,
    explanation: "In a balanced BST, each comparison eliminates half the remaining nodes, leading to O(log N) time."
  },
  {
    question: "Which algorithm is best suited to find the shortest path in an unweighted graph?",
    options: ["Depth-First Search (DFS)", "Dijkstra's Algorithm", "Breadth-First Search (BFS)", "A* Search"],
    correctIndex: 2,
    explanation: "BFS processes nodes level by level, guaranteeing the shortest path in unweighted graphs."
  },
  {
    question: "What does the ACID property 'Durability' ensure in a database?",
    options: ["Transactions are processed in isolation", "Committed transactions are permanently saved", "Database rules are never violated", "Data is always available"],
    correctIndex: 1,
    explanation: "Durability guarantees that once a transaction has been committed, it will remain committed even in the case of a system failure."
  },
  {
    question: "What is a 'Race Condition' in concurrent programming?",
    options: ["When multiple threads execute at the exact same speed", "When thread execution order affects the final correct result", "When a process consumes all CPU resources", "When two threads wait on each other infinitely"],
    correctIndex: 1,
    explanation: "A race condition occurs when the system's substantive behavior depends on the sequence or timing of uncontrollable events."
  },
  {
    question: "Which TCP/IP layer is responsible for routing packets across network boundaries?",
    options: ["Application Layer", "Transport Layer", "Network Layer", "Data Link Layer"],
    correctIndex: 2,
    explanation: "The Network Layer (specifically IP) is responsible for packet forwarding including routing through intermediate routers."
  },
  {
    question: "What is the fundamental difference between a Process and a Thread?",
    options: ["Threads cannot run concurrently, processes can", "Threads share memory within the same process", "Processes are faster to create than threads", "A thread can contain multiple processes"],
    correctIndex: 1,
    explanation: "Threads of the same process run in a shared memory space, while processes run in separate memory spaces."
  },
  {
    question: "What is the time complexity of inserting an element at the beginning of a standard dynamic Array?",
    options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"],
    correctIndex: 2,
    explanation: "Inserting at the beginning requires shifting all existing elements one position to the right, taking O(N) time."
  },
  {
    question: "Which garbage collection algorithm does V8 (Node.js/Chrome) primarily use for long-lived objects?",
    options: ["Reference Counting", "Mark-and-Sweep", "Copying Collection", "Automatic Reference Counting (ARC)"],
    correctIndex: 1,
    explanation: "V8's major garbage collector uses a Mark-and-Sweep algorithm to reclaim memory from the old generation."
  }
];

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [quizScore, setQuizScore] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userBaseXP, setUserBaseXP] = useState(() => Number(localStorage.getItem('userXP') || 11200));
  const [studentsData, setStudentsData] = useState([]);
  
  useEffect(() => {
    let multiplier = 1;
    if (activeTab === 'monthly') multiplier = 4.2;
    if (activeTab === 'all-time') multiplier = 12.5;

    const bots = [
      { id: '1', name: 'Sarah Chen', base: 11250, streak: 45 },
      { id: '3', name: 'David Smith', base: 10850, streak: 28 },
      { id: '4', name: 'Emma Wilson', base: 9500, streak: 15 },
      { id: '5', name: 'James Lee', base: 8200, streak: 12 },
    ];

    setStudentsData([
      { id: 'me', name: 'Alex Doe', xp: Math.floor(userBaseXP * multiplier), streak: 32 },
      ...bots.map(b => ({ ...b, xp: Math.floor(b.base * multiplier) }))
    ]);
  }, [activeTab, userBaseXP]);

  const sortedStudents = [...studentsData].sort((a, b) => b.xp - a.xp).map((student, index) => {
    let badge = Star;
    let color = 'blue';
    if (index === 0) { badge = Crown; color = 'yellow'; }
    else if (index === 1) { badge = Medal; color = 'gray'; }
    else if (index === 2) { badge = Medal; color = 'orange'; }
    
    return { ...student, rank: index + 1, badge, color };
  });

  const currentUser = sortedStudents.find(s => s.id === 'me') || { xp: 0, rank: 0 };

  const startQuiz = () => {
    const randomQ = QUIZ_POOL[Math.floor(Math.random() * QUIZ_POOL.length)];
    setCurrentQuiz(randomQ);
    setQuizScore(null);
    setSelectedOption(null);
    setShowQuiz(true);
  };

  const handleOptionClick = (index) => {
    setSelectedOption(index);
    if (index === currentQuiz.correctIndex) {
      setQuizScore(100);
    } else {
      setQuizScore(-50);
    }
  };

  const handleCompleteQuiz = () => {
    if (quizScore !== null) {
      const newXP = userBaseXP + quizScore;
      setUserBaseXP(newXP);
      localStorage.setItem('userXP', newXP);
    }
    setShowQuiz(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Practice & Leaderboard</h1>
        <p className="text-gray-400">Compete with others, earn XP, and climb the ranks.</p>
      </header>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          {/* Daily Status */}
          <div className="glass-panel p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Flame className="w-32 h-32 text-orange-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">32 Day Streak!</h2>
                  <p className="text-sm text-orange-300">You're on fire 🔥</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Total XP</p>
                  <p className="text-2xl font-bold text-white">{currentUser.xp.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-gray-400 mb-1">Current Rank</p>
                  <p className="text-2xl font-bold text-white">#{currentUser.rank}</p>
                </div>
              </div>

              <button 
                onClick={startQuiz}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-orange-500/25 border-none text-white"
              >
                <Brain className="w-5 h-5" />
                Start AI Practice Quiz
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="glass-panel p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Medal className="w-5 h-5 text-yellow-400" />
              Recent Badges
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: '7-Day Streak', icon: Flame, color: 'orange' },
                { name: 'DSA Master', icon: Trophy, color: 'purple' },
                { name: 'Top 10', icon: Crown, color: 'yellow' }
              ].map((badge, i) => (
                <div key={i} className="flex flex-col items-center text-center p-3 rounded-xl bg-white/5 border border-white/10 group hover:bg-white/10 transition-colors">
                  <badge.icon className={`w-8 h-8 text-${badge.color}-400 mb-2 group-hover:scale-110 transition-transform`} />
                  <span className="text-xs text-gray-400 font-medium">{badge.name}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setShowAllBadges(true)}
              className="w-full mt-4 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All Badges
            </button>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2 glass-panel p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              Global Leaderboard
            </h2>
            
            <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
              {['weekly', 'monthly', 'all-time'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
                    activeTab === tab 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-sm">
                  <th className="p-4 font-medium rounded-tl-xl">Rank</th>
                  <th className="p-4 font-medium">Student</th>
                  <th className="p-4 font-medium text-right">Streak</th>
                  <th className="p-4 font-medium text-right rounded-tr-xl">XP Points</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student) => (
                  <tr 
                    key={student.id} 
                    className={`border-b border-white/5 transition-all duration-500 hover:bg-white/5 ${
                      student.id === 'me' ? 'bg-blue-500/10 border-blue-500/20' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${
                        student.rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
                        student.rank === 2 ? 'bg-gray-300/20 text-gray-300' :
                        student.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-white/5 text-gray-500'
                      }`}>
                        {student.rank}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-white text-sm">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-white flex items-center gap-2">
                            {student.name}
                            {student.rank <= 3 && <student.badge className={`w-4 h-4 transition-colors duration-500 text-${student.color}-400`} />}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-sm font-medium border border-orange-500/20">
                        <Flame className="w-3.5 h-3.5" />
                        {student.streak}
                      </div>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-blue-400 transition-all duration-500">
                      {student.xp.toLocaleString()} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      {showQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel p-8 max-w-lg w-full bg-[#1e293b] border-orange-500/30 shadow-2xl shadow-orange-500/10"
           >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Brain className="w-6 h-6 text-orange-500" /> AI Tech Quiz
              </h2>
              {quizScore === null && currentQuiz ? (
                <>
                  <p className="text-gray-300 mb-6 text-lg">{currentQuiz.question}</p>
                  <div className="space-y-3 mb-6">
                    {currentQuiz.options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleOptionClick(idx)} 
                        className="w-full p-4 rounded-xl border border-white/10 hover:bg-white/10 text-left text-white transition-all hover:pl-6 focus:bg-white/10"
                      >
                        {String.fromCharCode(65 + idx)}. {opt}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowQuiz(false)} className="text-gray-500 hover:text-white text-sm w-full transition-colors">Cancel Quiz</button>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="text-6xl mb-4">{quizScore > 0 ? '🎉' : '❌'}</div>
                  <h3 className={`text-3xl font-bold mb-2 ${quizScore > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {quizScore > 0 ? '+100 XP Earned!' : '-50 XP Deducted!'}
                  </h3>
                  <p className="text-gray-300 mb-8 text-lg">
                    {quizScore > 0 ? `Correct! ${currentQuiz?.explanation}` : `The correct answer was Option ${String.fromCharCode(65 + currentQuiz?.correctIndex)}. ${currentQuiz?.explanation}`}
                  </p>
                  <button onClick={handleCompleteQuiz} className="w-full btn-primary py-3 bg-gradient-to-r from-orange-500 to-red-500 border-none text-white text-lg font-bold shadow-lg shadow-orange-500/30">
                    Return to Leaderboard
                  </button>
                </motion.div>
              )}
           </motion.div>
        </div>
      )}

      {/* Badges Modal */}
      {showAllBadges && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 max-w-2xl w-full bg-[#1e293b] border-blue-500/30"
           >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Medal className="w-6 h-6 text-blue-400" /> All Available Badges
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 max-h-[60vh] overflow-y-auto">
                {[
                  { name: '7-Day Streak', desc: 'Maintain a 7-day practice streak', icon: Flame, color: 'orange', locked: false },
                  { name: 'DSA Master', desc: 'Complete 50 Data Structure questions', icon: Trophy, color: 'purple', locked: false },
                  { name: 'Top 10', desc: 'Reach the global Top 10 rank', icon: Crown, color: 'yellow', locked: false },
                  { name: 'Bug Squasher', desc: 'Identify 10 logic errors', icon: AlertTriangle, color: 'emerald', locked: true },
                  { name: 'Speed Runner', desc: 'Solve a Medium question in < 5 mins', icon: Clock, color: 'blue', locked: true },
                  { name: 'System Architect', desc: 'Complete System Design module', icon: Cpu, color: 'cyan', locked: true }
                ].map((badge, i) => (
                  <div key={i} className={`p-4 rounded-xl border ${badge.locked ? 'bg-black/20 border-white/5 opacity-50' : 'bg-white/5 border-white/10'} flex flex-col items-center text-center`}>
                    <badge.icon className={`w-10 h-10 mb-3 text-${badge.color}-400 ${badge.locked ? 'grayscale' : ''}`} />
                    <span className="font-bold text-white text-sm mb-1">{badge.name}</span>
                    <span className="text-xs text-gray-400">{badge.desc}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowAllBadges(false)} className="w-full btn-secondary py-3 text-white">
                Close
              </button>
           </motion.div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
