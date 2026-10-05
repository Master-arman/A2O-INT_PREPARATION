import { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart3,
  Bookmark,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Code,
  Code2,
  FileUp,
  Filter,
  Flame,
  LayoutGrid,
  Lightbulb,
  Mic,
  Plus,
  Search,
  Sparkles,
  Target,
  Trophy,
  User,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import MockInterviewModal from '../../components/MockInterviewModal';
import ActivityHeatmap from '../../components/ActivityHeatmap';
import { getSolvedQuestions, recordSolvedQuestion, unrecordSolvedQuestion, syncFromSupabaseCloud } from '../../utils/activityTracker';

const topics = ['All Topics', 'Algorithms', 'System Design', 'Frontend React', 'Behavioral', 'Databases'];
const companies = ['Google', 'Amazon', 'Microsoft'];

const MASTER_QUESTIONS = [
  { id: 'algo-1', title: 'Two Sum', category: 'Algorithms', pattern: 'Two Pointers', company: 'Meta', success: '58.1%', difficulty: 'Easy', solved: true },
  { id: 'algo-2', title: 'Trapping Rain Water', category: 'Algorithms', pattern: 'Two Pointers', company: 'Google', success: '46.7%', difficulty: 'Hard', solved: false },
  { id: 'algo-3', title: 'Longest Substring Without Repeating Characters', category: 'Algorithms', pattern: 'Sliding Window', company: 'Amazon', success: '40.0%', difficulty: 'Medium', solved: false },
  { id: 'algo-4', title: 'Linked List Cycle', category: 'Algorithms', pattern: 'Fast & Slow Pointers', company: 'Microsoft', success: '51.2%', difficulty: 'Easy', solved: false },
  { id: 'algo-5', title: 'Daily Temperatures', category: 'Algorithms', pattern: 'Monotonic Stack', company: 'Meta', success: '67.4%', difficulty: 'Medium', solved: false },
  { id: 'algo-6', title: 'Largest Rectangle in Histogram', category: 'Algorithms', pattern: 'Monotonic Stack', company: 'Google', success: '44.6%', difficulty: 'Hard', solved: false },
  { id: 'algo-7', title: 'Merge Intervals', category: 'Algorithms', pattern: 'Intervals', company: 'Microsoft', success: '48.5%', difficulty: 'Medium', solved: false },
  { id: 'algo-8', title: 'Insert Interval', category: 'Algorithms', pattern: 'Intervals', company: 'Amazon', success: '42.8%', difficulty: 'Medium', solved: false },
  { id: 'algo-9', title: 'Top K Frequent Elements', category: 'Algorithms', pattern: 'Top K / Heaps', company: 'Google', success: '64.3%', difficulty: 'Medium', solved: false },
  { id: 'algo-10', title: 'Lowest Common Ancestor of a Binary Tree', category: 'Algorithms', pattern: 'Tree DFS/BFS', company: 'Amazon', success: '61.8%', difficulty: 'Medium', solved: false },
  { id: 'algo-11', title: 'Word Ladder', category: 'Algorithms', pattern: 'Tree DFS/BFS', company: 'Microsoft', success: '39.1%', difficulty: 'Hard', solved: false },
  { id: 'algo-12', title: 'Coin Change', category: 'Algorithms', pattern: 'Dynamic Programming', company: 'Meta', success: '47.9%', difficulty: 'Medium', solved: false },
  { id: 'algo-13', title: '0/1 Knapsack', category: 'Algorithms', pattern: 'Dynamic Programming', company: 'Google', success: '53.4%', difficulty: 'Hard', solved: false },
  { id: 'algo-14', title: 'LRU Cache', category: 'Algorithms', pattern: 'Design + Hash Map', company: 'Amazon', success: '39.8%', difficulty: 'Medium', solved: false },
  { id: 'design-1', title: 'Distributed Rate Limiter', category: 'System Design', pattern: 'Distributed Systems', company: 'Google', success: '35.2%', difficulty: 'Hard', solved: false },
  { id: 'design-2', title: 'TinyURL Shortener', category: 'System Design', pattern: 'URL Shortening', company: 'Amazon', success: '49.6%', difficulty: 'Medium', solved: false },
  { id: 'design-3', title: 'Event-Driven Notification Service', category: 'System Design', pattern: 'Kafka / Event Streaming', company: 'Microsoft', success: '31.4%', difficulty: 'Hard', solved: false },
  { id: 'design-4', title: 'Real-time Chat Architecture', category: 'System Design', pattern: 'WebSockets', company: 'Meta', success: '37.8%', difficulty: 'Hard', solved: false },
  { id: 'react-1', title: 'Virtualized List Windowing', category: 'Frontend React', pattern: 'Performance', company: 'Google', success: '42.7%', difficulty: 'Hard', solved: false },
  { id: 'react-2', title: 'Build a Custom useQuery with Cache', category: 'Frontend React', pattern: 'React Hooks', company: 'Microsoft', success: '55.4%', difficulty: 'Medium', solved: false },
  { id: 'react-3', title: 'Debounced Search with AbortController', category: 'Frontend React', pattern: 'Async UI', company: 'Amazon', success: '62.1%', difficulty: 'Medium', solved: false },
  { id: 'react-4', title: 'Multi-Step Form State Machine', category: 'Frontend React', pattern: 'State Machines', company: 'Meta', success: '58.8%', difficulty: 'Medium', solved: false },
  { id: 'db-1', title: 'Composite Index Optimization', category: 'Databases', pattern: 'Query Performance', company: 'Google', success: '45.8%', difficulty: 'Medium', solved: false },
  { id: 'db-2', title: 'ACID Isolation and Locking', category: 'Databases', pattern: 'Transactions', company: 'Amazon', success: '38.5%', difficulty: 'Hard', solved: false },
  { id: 'db-3', title: 'Normalize a Schema to 3NF and BCNF', category: 'Databases', pattern: 'Normalization', company: 'Microsoft', success: '52.9%', difficulty: 'Medium', solved: false },
  { id: 'behavior-1', title: 'Resolve a Technical Conflict', category: 'Behavioral', pattern: 'STAR Framework', company: 'Google', success: '72.2%', difficulty: 'Easy', solved: false },
  { id: 'behavior-2', title: 'Respond to a Production Outage', category: 'Behavioral', pattern: 'STAR Framework', company: 'Amazon', success: '69.4%', difficulty: 'Medium', solved: false },
  { id: 'behavior-3', title: 'Clarify Ambiguous Requirements', category: 'Behavioral', pattern: 'STAR Framework', company: 'Microsoft', success: '74.1%', difficulty: 'Easy', solved: false },
];

const generatedTemplates = [
  { pattern: 'Binary Search', title: 'Search the First Valid Capacity', category: 'Algorithms', difficulty: 'Medium', company: 'TechPrep' },
  { pattern: 'Union Find', title: 'Connect Components in a Network', category: 'Algorithms', difficulty: 'Medium', company: 'TechPrep' },
  { pattern: 'Rendering Optimization', title: 'Prioritize Visible Dashboard Widgets', category: 'Frontend React', difficulty: 'Hard', company: 'TechPrep' },
  { pattern: 'Sliding Window', title: 'Minimum Window Meeting a Target', category: 'Algorithms', difficulty: 'Medium', company: 'TechPrep' },
  { pattern: 'Dynamic Programming', title: 'Maximum Score Path Through a Grid', category: 'Algorithms', difficulty: 'Hard', company: 'TechPrep' },
  { pattern: 'React Hooks', title: 'Resilient Paginated Data Hook', category: 'Frontend React', difficulty: 'Medium', company: 'TechPrep' },
  { pattern: 'Distributed Systems', title: 'Design a Multi-Region Feature Flag Service', category: 'System Design', difficulty: 'Hard', company: 'TechPrep' },
  { pattern: 'Transactions', title: 'Prevent Overselling During Checkout', category: 'Databases', difficulty: 'Hard', company: 'TechPrep' },
  { pattern: 'STAR Framework', title: 'Lead a Project With a Missed Deadline', category: 'Behavioral', difficulty: 'Easy', company: 'TechPrep' },
];

const QUESTION_HINTS = {
  'algo-1': {
    patternDesc: 'Use a Hash Map to store complement values (target - current) in a single pass for O(N) lookup instead of nested loops.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    edgeCases: ['No two elements sum up to target (handle edge gracefully)', 'Cannot use the exact same element twice (distinct indices)'],
  },
  'algo-2': {
    patternDesc: 'Maintain left and right maximum heights using two pointers moving inward. Trapped water at each index equals min(maxLeft, maxRight) - height.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    edgeCases: ['Array has fewer than 3 bars (traps 0 water)', 'Strictly ascending or strictly descending elevations'],
  },
  'algo-3': {
    patternDesc: 'Sliding Window with Hash Map: Expand right pointer storing last seen indices; jump left pointer past duplicate index when duplicate is encountered.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(min(N, M))',
    edgeCases: ['Empty string or string with 1 character', 'All identical characters (e.g., "aaaaa")'],
  },
  'algo-4': {
    patternDesc: "Floyd's Fast & Slow Pointers (Tortoise and Hare): Slow pointer advances 1 node, fast pointer advances 2. If pointers collide, cycle detected.",
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    edgeCases: ['Empty list (head is null) or single node without cycle', 'Cycle length of 1 pointing to itself'],
  },
  'algo-5': {
    patternDesc: 'Monotonic Decreasing Stack storing day indices. When a warmer day arrives, pop indices and calculate day difference.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    edgeCases: ['Temperatures in strictly descending order (all 0s output)', 'Single day input array'],
  },
  'algo-6': {
    patternDesc: 'Monotonic Increasing Stack of indices: When a shorter bar is encountered, pop previous bars and compute area using current index as right boundary.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    edgeCases: ['All bars are the same height', 'Strictly increasing or decreasing heights'],
  },
  'algo-7': {
    patternDesc: 'Sort intervals by start time. Iterate through intervals and merge if current interval start <= previous interval end.',
    timeComplexity: 'O(N log N)',
    spaceComplexity: 'O(N)',
    edgeCases: ['Non-overlapping sequential intervals', 'One interval completely contained inside another'],
  },
  'algo-8': {
    patternDesc: 'Add all intervals ending before newInterval, merge all overlapping intervals into newInterval, then append all remaining intervals.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(N)',
    edgeCases: ['New interval belongs at extreme beginning or end', 'Original intervals list is empty'],
  },
  'algo-9': {
    patternDesc: 'Calculate frequencies with a Hash Map, then maintain a Min-Heap of size K or use Bucket Sort based on frequencies.',
    timeComplexity: 'O(N log K)',
    spaceComplexity: 'O(N)',
    edgeCases: ['K equals the number of unique elements', 'All elements have identical frequencies'],
  },
  'algo-10': {
    patternDesc: 'Recursive DFS: Return node if it matches p or q. If both left and right recursive calls return non-null, the current node is the LCA.',
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(H)',
    edgeCases: ['One target node is direct ancestor of the other', 'Target nodes located in completely separate subtrees'],
  },
  'algo-11': {
    patternDesc: 'BFS level-order search for shortest path in an unweighted word graph. Mutate each character of current word against word set.',
    timeComplexity: 'O(M² × N)',
    spaceComplexity: 'O(M × N)',
    edgeCases: ['endWord not in wordList (return 0)', 'startWord already equals endWord'],
  },
  'algo-12': {
    patternDesc: 'Bottom-up Dynamic Programming: dp[i] = min(dp[i], dp[i - coin] + 1) for each coin denomination up to target amount.',
    timeComplexity: 'O(amount × N)',
    spaceComplexity: 'O(amount)',
    edgeCases: ['Amount is 0 (requires 0 coins)', 'Amount cannot be formed with denominations (return -1)'],
  },
  'algo-13': {
    patternDesc: '1D DP array computed right-to-left: dp[w] = max(dp[w], dp[w - weight[i]] + val[i]) ensuring single inclusion per item.',
    timeComplexity: 'O(N × W)',
    spaceComplexity: 'O(W)',
    edgeCases: ['Knapsack capacity is 0', 'All item weights exceed knapsack capacity'],
  },
  'algo-14': {
    patternDesc: 'Hash Map for O(1) key-to-node lookup combined with a Doubly Linked List for O(1) node removal and insertion at head.',
    timeComplexity: 'O(1) get & put',
    spaceComplexity: 'O(Capacity)',
    edgeCases: ['Updating existing key value without evicting other keys', 'Cache capacity of 1'],
  },
  'design-1': {
    patternDesc: 'Sliding Window Log or Token Bucket algorithm using Redis atomic Lua scripts (INCR, EXPIRE) for distributed rate evaluation.',
    timeComplexity: 'O(1) per check',
    spaceComplexity: 'O(Users × Windows)',
    edgeCases: ['High concurrency burst traffic race conditions', 'Redis cluster network partition / failover'],
  },
  'design-2': {
    patternDesc: 'Base62 encode distributed 64-bit unique IDs (Snowflake IDs) with distributed caching for sub-millisecond redirect resolution.',
    timeComplexity: 'O(1) read & write',
    spaceComplexity: 'O(Total URLs)',
    edgeCases: ['Counter overflow / ID collisions', 'Expired URL access and malicious target redirect'],
  },
  'design-3': {
    patternDesc: 'Decoupled event publisher with partitioned Kafka topics by user_id, priority queues, retry topics, and Dead Letter Queues (DLQ).',
    timeComplexity: 'O(1) ingestion',
    spaceComplexity: 'O(Queue Buffer)',
    edgeCases: ['Duplicate message delivery (require idempotent consumer logic)', 'External delivery provider rate-limiting'],
  },
  'design-4': {
    patternDesc: 'Persistent WebSockets connected to gateway pods backed by Redis Pub/Sub / Kafka cluster for multi-server message routing.',
    timeComplexity: 'O(1) latency',
    spaceComplexity: 'O(Active Sockets)',
    edgeCases: ['Mass reconnect storms (thundering herd problem)', 'Offline message delivery catch-up'],
  },
  'react-1': {
    patternDesc: 'Calculate viewport slice using scrollTop and container height. Render only visible items plus an overscan buffer to keep DOM lightweight.',
    timeComplexity: 'O(Visible Items)',
    spaceComplexity: 'O(Visible Nodes)',
    edgeCases: ['Variable dynamic item heights without initial measurement', 'Rapid momentum scrolling causing blank gaps'],
  },
  'react-2': {
    patternDesc: 'Custom hook wrapping useEffect with module-level cache map, deduplication of concurrent fetches, and TTL expiration.',
    timeComplexity: 'O(1) cache read',
    spaceComplexity: 'O(Cache Entries)',
    edgeCases: ['Component unmount while fetch is in-flight (AbortController)', 'Race condition with stale responses overwriting newer data'],
  },
  'react-3': {
    patternDesc: 'Debounce input handler with setTimeout and cancel in-flight queries using AbortController on each subsequent keystroke.',
    timeComplexity: 'O(1) per keystroke',
    spaceComplexity: 'O(1)',
    edgeCases: ['Slow earlier responses resolving after newer response', 'Component unmount with pending debounce timer'],
  },
  'react-4': {
    patternDesc: 'Finite State Machine (useReducer) enforcing allowed state transitions and validating each step payload before progressing.',
    timeComplexity: 'O(1) transition',
    spaceComplexity: 'O(State Schema)',
    edgeCases: ['User navigates back and edits dependencies that invalidate next steps', 'Hydration mismatch on page refresh'],
  },
  'db-1': {
    patternDesc: 'Apply Leftmost Prefix Rule: Create index on (equality_col1, equality_col2, range_col) to avoid full table scans.',
    timeComplexity: 'O(log N) scan',
    spaceComplexity: 'O(Index Size)',
    edgeCases: ['Functions applied on columns (e.g. UPPER(name)) bypass standard index', 'Index selectivity on low cardinality columns'],
  },
  'db-2': {
    patternDesc: 'Utilize MVCC and Row-level locking to balance concurrency and consistency across Read Committed and Repeatable Read isolation levels.',
    timeComplexity: 'O(1) snapshot',
    spaceComplexity: 'O(Undo Logs)',
    edgeCases: ['Deadlocks from conflicting lock acquisition orders', 'Long transactions preventing vacuum / undo cleanup'],
  },
  'db-3': {
    patternDesc: 'Decompose relations into 3NF and BCNF by removing partial and transitive functional dependencies while preserving join dependencies.',
    timeComplexity: 'Design Phase',
    spaceComplexity: 'Normalized Schema',
    edgeCases: ['Over-normalization introducing excessive JOIN query latency', 'Preserving cross-table dependency constraints'],
  },
  'behavior-1': {
    patternDesc: 'STAR framework: Focus on objective criteria, data-driven POCs, empathetic active listening, and committing to shared team goals.',
    timeComplexity: 'STAR Method',
    spaceComplexity: 'Team Consensus',
    edgeCases: ['Strongly opinionated stakeholders with no tiebreaker', 'Time constraints requiring immediate decision'],
  },
  'behavior-2': {
    patternDesc: 'STAR framework: Incident management, immediate mitigation/rollback over root cause analysis, transparent status communication, blameless post-mortem.',
    timeComplexity: 'STAR Method',
    spaceComplexity: 'Incident SLA',
    edgeCases: ['Remediation action causing a secondary regression', 'Ambiguous logs / missing metrics during triage'],
  },
  'behavior-3': {
    patternDesc: 'STAR framework: Document assumptions in an RFC, construct rapid wireframes/prototypes, align on MVP scope with product owners.',
    timeComplexity: 'STAR Method',
    spaceComplexity: 'Scope Clarity',
    edgeCases: ['Conflicting requirements from multiple executive stakeholders', 'Late-stage requirement changes'],
  },
};

const getQuestionHint = (question) => {
  if (QUESTION_HINTS[question.id]) {
    return QUESTION_HINTS[question.id];
  }
  return {
    patternDesc: `Apply the ${question.pattern} pattern to optimize state transitions and avoid redundant operations for ${question.title}.`,
    timeComplexity: question.category === 'Algorithms' ? 'O(N)' : 'O(1)',
    spaceComplexity: question.category === 'Algorithms' ? 'O(1)' : 'O(N)',
    edgeCases: ['Empty or boundary input conditions', 'Extreme large scale / concurrent edge loads'],
  };
};

const difficultyClass = {
  Easy: 'text-[#00b8a3] bg-[#00b8a3]/10 border border-[#00b8a3]/20',
  Medium: 'text-[#ffc01e] bg-[#ffc01e]/10 border border-[#ffc01e]/20',
  Hard: 'text-[#ff375f] bg-[#ff375f]/10 border border-[#ff375f]/20',
};

const FeatureCard = ({ icon: Icon, title, subtitle }) => (
  <Link to="/interviews" className="min-w-[220px] flex-1 rounded-xl border border-[#383838] bg-[#282828] p-4 transition-colors hover:bg-[#323232]">
    <div className="flex items-start justify-between gap-3">
      <div className="rounded-lg bg-[#ffa116]/15 p-2 text-[#ffa116]">
        <Icon className="h-5 w-5" />
      </div>
      <ChevronRight className="h-4 w-4 text-[#8a8a8a]" />
    </div>
    <h3 className="mt-5 text-sm font-semibold text-white">{title}</h3>
    <p className="mt-1 text-xs text-[#8a8a8a]">{subtitle}</p>
  </Link>
);

const Dashboard = () => {
  const [userName, setUserName] = useState('User');
  const [questions, setQuestions] = useState(() => {
    try {
      const solvedSet = getSolvedQuestions();
      return MASTER_QUESTIONS.map(q => ({
        ...q,
        solved: solvedSet.has(q.id)
      }));
    } catch {
      return MASTER_QUESTIONS;
    }
  });
  const [activeTopic, setActiveTopic] = useState('All Topics');
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState('All difficulties');
  const [activeCompany, setActiveCompany] = useState('');
  const [isMockInterviewOpen, setIsMockInterviewOpen] = useState(false);
  const [expandedHints, setExpandedHints] = useState(new Set());
  const [showSavedOnly, setShowSavedOnly] = useState(false);

  const [savedQuestionIds, setSavedQuestionIds] = useState(() => {
    try {
      const saved = localStorage.getItem('saved_questions');
      return saved ? new Set(JSON.parse(saved)) : new Set(['algo-1', 'algo-2', 'design-1']);
    } catch {
      return new Set(['algo-1', 'algo-2', 'design-1']);
    }
  });

  useEffect(() => {
    const authUserStr = localStorage.getItem('user');
    if (authUserStr) {
      try {
        const authData = JSON.parse(authUserStr);
        setUserName(authData.name ? authData.name.split(' ')[0] : 'User');
        if (authData.id && authData.id !== 'local_user') {
          syncFromSupabaseCloud(authData.id);
        }
      } catch (err) {
        console.warn('Dashboard auth parse notice:', err);
      }
    }

    const handleSolvedUpdate = () => {
      const solvedSet = getSolvedQuestions();
      setQuestions((prev) => prev.map(q => ({
        ...q,
        solved: solvedSet.has(q.id)
      })));
    };

    window.addEventListener('solved-questions-updated', handleSolvedUpdate);
    return () => window.removeEventListener('solved-questions-updated', handleSolvedUpdate);
  }, []);

  const toggleBookmark = (questionId) => {
    setSavedQuestionIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      try {
        localStorage.setItem('saved_questions', JSON.stringify(Array.from(next)));
      } catch (e) {
        console.error(e);
      }
      return next;
    });
  };

  const toggleHint = (questionId) => {
    setExpandedHints((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) {
        next.delete(questionId);
      } else {
        next.add(questionId);
      }
      return next;
    });
  };

  const filteredQuestions = useMemo(() => questions.filter((question) => {
    const query = searchTerm.trim().toLowerCase();
    const matchesTopic = activeTopic === 'All Topics' || question.category === activeTopic;
    const matchesDifficulty = difficulty === 'All difficulties' || question.difficulty === difficulty;
    const matchesCompany = !activeCompany || question.company === activeCompany;
    const matchesSaved = !showSavedOnly || savedQuestionIds.has(question.id);
    const matchesSearch = !query || `${question.title} ${question.pattern} ${question.company}`.toLowerCase().includes(query);
    return matchesTopic && matchesDifficulty && matchesCompany && matchesSaved && matchesSearch;
  }), [activeCompany, activeTopic, difficulty, questions, savedQuestionIds, searchTerm, showSavedOnly]);

  const solvedCount = questions.filter((question) => question.solved).length;

  const toggleSolved = (questionId) => {
    setQuestions((currentQuestions) => {
      const target = currentQuestions.find(q => q.id === questionId);
      if (target) {
        if (!target.solved) {
          recordSolvedQuestion(questionId);
        } else {
          unrecordSolvedQuestion(questionId);
        }
      }
      return currentQuestions.map((question) => (
        question.id === questionId ? { ...question, solved: !question.solved } : question
      ));
    });
  };

  const generateQuestion = () => {
    const servedPatterns = new Set(questions.map((question) => question.pattern));
    const availableTemplates = generatedTemplates.filter((template) => !servedPatterns.has(template.pattern));
    const source = availableTemplates.length > 0 ? availableTemplates : generatedTemplates;
    const template = source[Math.floor(Math.random() * source.length)];
    const generatedQuestion = { ...template, id: `ai-${Date.now()}`, success: 'New', solved: false, aiGenerated: true };
    setQuestions((currentQuestions) => [generatedQuestion, ...currentQuestions]);
  };

  const selectCompany = (company) => setActiveCompany((currentCompany) => (currentCompany === company ? '' : company));

  return (
    <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-[#1a1a1a] text-neutral-200">
      <MockInterviewModal isOpen={isMockInterviewOpen} onClose={() => setIsMockInterviewOpen(false)} />
      <div className="max-w-[1500px] mx-auto grid grid-cols-12 items-start gap-6 px-4 py-6">
        {/* Left Sidebar: All Platform Features */}
        <aside className="col-span-12 space-y-4 md:col-span-3 lg:col-span-2">
          <div>
            <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">Features</p>
            <div className="space-y-1">
              <Link
                to="/"
                onClick={() => setShowSavedOnly(false)}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  !showSavedOnly
                    ? 'border border-[#ffa116]/40 bg-[#ffa116]/15 font-semibold text-[#ffa116]'
                    : 'text-[#a3a3a3] hover:bg-[#2d2d2d] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <LayoutGrid className="h-4 w-4" /> Practice Hub
                </span>
              </Link>

              <Link
                to="/courses"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#a3a3a3] transition-colors hover:bg-[#2d2d2d] hover:text-white"
              >
                <BookOpen className="h-4 w-4 text-[#ffa116]" /> Courses & Tutorials
              </Link>

              <Link
                to="/interviews"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#a3a3a3] transition-colors hover:bg-[#2d2d2d] hover:text-white"
              >
                <Flame className="h-4 w-4 text-[#ffa116]" /> Mock Interview
              </Link>

              <Link
                to="/coding"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#a3a3a3] transition-colors hover:bg-[#2d2d2d] hover:text-white"
              >
                <Code className="h-4 w-4 text-[#00b8a3]" /> Coding Env
              </Link>

              <Link
                to="/voice-interview"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#a3a3a3] transition-colors hover:bg-[#2d2d2d] hover:text-white"
              >
                <Mic className="h-4 w-4 text-[#ff375f]" /> Voice AI
              </Link>

              <Link
                to="/resume"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#a3a3a3] transition-colors hover:bg-[#2d2d2d] hover:text-white"
              >
                <FileUp className="h-4 w-4 text-[#9333ea]" /> Resume AI
              </Link>

              <Link
                to="/company"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#a3a3a3] transition-colors hover:bg-[#2d2d2d] hover:text-white"
              >
                <Building2 className="h-4 w-4 text-[#ffc01e]" /> Company Prep
              </Link>

              <Link
                to="/analytics"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#a3a3a3] transition-colors hover:bg-[#2d2d2d] hover:text-white"
              >
                <BarChart3 className="h-4 w-4 text-[#00b8a3]" /> Analytics
              </Link>

              <Link
                to="/leaderboard"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#a3a3a3] transition-colors hover:bg-[#2d2d2d] hover:text-white"
              >
                <Trophy className="h-4 w-4 text-[#ffa116]" /> Leaderboard
              </Link>
            </div>
          </div>

          <div className="border-t border-[#383838] pt-3">
            <p className="mb-2.5 px-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">Workspace</p>
            <div className="space-y-1">
              <button
                onClick={() => setShowSavedOnly((prev) => !prev)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  showSavedOnly
                    ? 'border border-[#ffa116]/40 bg-[#ffa116]/15 font-semibold text-[#ffa116]'
                    : 'text-[#a3a3a3] hover:bg-[#2d2d2d] hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Bookmark className={`h-4 w-4 ${showSavedOnly ? 'fill-[#ffa116]' : ''}`} /> Saved Questions
                </span>
                {savedQuestionIds.size > 0 && (
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    showSavedOnly ? 'bg-[#ffa116] text-black' : 'bg-[#383838] text-[#8a8a8a]'
                  }`}>
                    {savedQuestionIds.size}
                  </span>
                )}
              </button>

              <Link
                to="/profile"
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#a3a3a3] transition-colors hover:bg-[#2d2d2d] hover:text-white"
              >
                <User className="h-4 w-4 text-[#00b8a3]" /> Profile & Settings
              </Link>
            </div>
          </div>

          <div className="border-t border-[#383838] pt-3">
            <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-[#8a8a8a]">Your Progress</p>
            <div className="mt-2.5 px-3">
              <div className="mb-1.5 flex justify-between text-xs">
                <span className="text-[#8a8a8a]">Readiness</span>
                <span className="font-semibold text-white">{Math.round((solvedCount / 250) * 100)}%</span>
              </div>
              <div className="h-1.5 rounded-full bg-[#383838]">
                <div
                  className="h-full rounded-full bg-[#ffa116] transition-all duration-500"
                  style={{ width: `${Math.min((solvedCount / 250) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Center Main Content */}
        <section className="col-span-12 min-w-0 space-y-6 md:col-span-9 lg:col-span-7">
          <header className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="mb-1 text-xs text-[#8a8a8a]">Good to see you, {userName}</p>
              <h1 className="text-2xl font-bold tracking-tight text-white">Practice Hub</h1>
              <p className="mt-1 text-sm text-[#8a8a8a]">Build the skills that get you interview-ready.</p>
            </div>

            {/* Start Mock Interview Button */}
            <button
              onClick={() => setIsMockInterviewOpen(true)}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-[#ffa116] px-4 py-2.5 text-sm font-bold text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_16px_rgba(255,161,22,0.4)] active:scale-95 active:duration-100"
            >
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
              <Flame className="h-4 w-4 fill-black/20" />
              <span>Start Mock Interview</span>
            </button>
          </header>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FeatureCard icon={Code2} title="School's in TechPrep" subtitle="DSA Assessment sprint" />
            <FeatureCard icon={Users} title="Unlock Full Interview Experience" subtitle="Mock interviews that feel real" />
            <FeatureCard icon={BarChart3} title="System Design & Cloud Architecture" subtitle="Build scalable systems" />
          </div>

          {/* Topic Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`shrink-0 rounded-full border px-3.5 py-1 text-xs font-medium transition-all duration-200 ease-out ${
                  activeTopic === topic
                    ? 'border-[#ffa116] bg-[#ffa116] text-black shadow-[0_0_10px_rgba(255,161,22,0.25)]'
                    : 'border-[#383838] bg-[#282828] text-neutral-300 hover:border-[#4f4f4f] hover:bg-[#333333]'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>

          {/* Practice Section & Question Table */}
          <div className="overflow-hidden rounded-xl border border-[#383838] bg-[#262626]">
            {/* Filter Toolbar */}
            <div className="flex flex-col justify-between gap-3 border-b border-[#383838] p-4 sm:flex-row sm:items-center">
              <label className="flex items-center gap-2 rounded-lg bg-[#383838] px-3 py-2 text-[#8a8a8a] sm:w-72">
                <Search className="h-4 w-4 shrink-0 text-[#8a8a8a]" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search title, pattern, company"
                  className="w-full min-w-0 bg-transparent text-sm text-white outline-none placeholder:text-[#8a8a8a]"
                />
              </label>

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8a8a8a]">
                <span className="font-medium text-[#ffa116]">{solvedCount} / 250 Solved</span>

                <select
                  value={difficulty}
                  onChange={(event) => setDifficulty(event.target.value)}
                  className="rounded-lg border border-[#383838] bg-[#2d2d2d] px-2.5 py-2 text-xs text-neutral-300 outline-none transition-colors hover:border-[#4a4a4a]"
                >
                  <option>All difficulties</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>

                <button
                  onClick={() => setShowSavedOnly((prev) => !prev)}
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-2 font-medium transition-all duration-200 ease-out active:scale-95 ${
                    showSavedOnly
                      ? 'border-[#ffa116] bg-[#ffa116]/15 text-[#ffa116]'
                      : 'border-[#383838] bg-[#2d2d2d] text-neutral-300 hover:border-[#4a4a4a] hover:bg-[#333333]'
                  }`}
                  title="Toggle Saved filter"
                >
                  <Bookmark className={`h-3.5 w-3.5 ${showSavedOnly ? 'fill-[#ffa116]' : ''}`} />
                  <span>Saved</span>
                </button>

                <button
                  onClick={generateQuestion}
                  className="group relative inline-flex items-center gap-1.5 overflow-hidden rounded-lg bg-[#ffa116] px-3 py-2 text-xs font-bold text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_12px_rgba(255,161,22,0.35)] active:scale-95 active:duration-100"
                >
                  <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                  <Plus className="h-3.5 w-3.5" />
                  <span>Generate Question</span>
                </button>
              </div>
            </div>

            {/* Table Header */}
            <div className="hidden grid-cols-[1fr_100px_90px_180px] items-center gap-4 border-b border-[#383838] px-4 py-3 text-[11px] uppercase tracking-wider text-[#8a8a8a] sm:grid">
              <span>Question</span>
              <span>Success</span>
              <span>Difficulty</span>
              <span className="text-right pr-2">Actions</span>
            </div>

            {filteredQuestions.length === 0 && (
              <div className="p-8 text-center text-sm text-[#8a8a8a]">
                {showSavedOnly ? 'No saved questions match these filters.' : 'No questions match these filters.'}
              </div>
            )}

            {/* Question Rows */}
            {filteredQuestions.map((question) => {
              const isExpanded = expandedHints.has(question.id);
              const isSaved = savedQuestionIds.has(question.id);
              const hintInfo = getQuestionHint(question);

              return (
                <div
                  key={question.id}
                  className={`border-b border-[#2e2e2e] transition-colors duration-200 ease-out ${
                    isExpanded ? 'bg-[#222222]' : 'hover:bg-[#2a2a2a]/60'
                  }`}
                >
                  {/* Row Header */}
                  <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4">
                    {/* Checkbox & Question Info */}
                    <div className="flex min-w-0 items-center gap-3">
                      <button
                        onClick={() => toggleSolved(question.id)}
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ease-out active:scale-90 ${
                          question.solved
                            ? 'border-[#00b8a3] bg-[#00b8a3]/10 text-[#00b8a3]'
                            : 'border-[#555] text-transparent hover:border-[#00b8a3]'
                        }`}
                        aria-label={question.solved ? `Mark ${question.title} incomplete` : `Mark ${question.title} solved`}
                      >
                        <Check className="h-3 w-3" />
                      </button>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white transition-colors hover:text-[#ffa116]">
                          {question.title}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="rounded bg-[#383838] px-1.5 py-0.5 text-[10px] text-[#9ca3af]">
                            {question.company}
                          </span>
                          <span className="rounded-full border border-[#383838] px-1.5 py-0.5 text-[10px] text-[#8a8a8a]">
                            [{question.pattern}]
                          </span>
                          {question.aiGenerated && (
                            <span className="rounded bg-[#ffa116]/15 px-1.5 py-0.5 text-[10px] text-[#ffa116]">
                              AI Generated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-3">
                      <span className="hidden shrink-0 text-xs text-[#9ca3af] md:block w-16 text-center">
                        {question.success}
                      </span>

                      <span className={`hidden shrink-0 rounded px-2 py-0.5 text-xs font-medium sm:inline-flex ${difficultyClass[question.difficulty]}`}>
                        {question.difficulty}
                      </span>

                      {/* Interactive Row Actions */}
                      <div className="flex shrink-0 items-center gap-1.5">
                        {/* Bookmark Button */}
                        <button
                          onClick={() => toggleBookmark(question.id)}
                          title={isSaved ? 'Remove from Saved' : 'Save Question'}
                          className={`group relative inline-flex shrink-0 items-center justify-center rounded-lg border p-1.5 text-xs transition-all duration-200 ease-out active:scale-95 ${
                            isSaved
                              ? 'border-[#ffa116]/50 bg-[#ffa116]/15 text-[#ffa116] shadow-[0_0_8px_rgba(255,161,22,0.2)]'
                              : 'border-[#383838] bg-[#2d2d2d] text-[#8a8a8a] hover:border-[#ffa116]/40 hover:bg-[#333333] hover:text-[#ffa116]'
                          }`}
                          aria-label={isSaved ? 'Saved' : 'Save question'}
                        >
                          <Bookmark className={`h-3.5 w-3.5 transition-all duration-200 ${isSaved ? 'fill-[#ffa116] text-[#ffa116] scale-105' : 'group-hover:scale-110'}`} />
                        </button>

                        {/* Quick Hint Button */}
                        <button
                          onClick={() => toggleHint(question.id)}
                          title={isExpanded ? 'Hide Hint' : 'Quick Hint'}
                          className={`group relative inline-flex shrink-0 items-center justify-center gap-1 rounded-lg border px-2 py-1.5 text-xs font-medium transition-all duration-200 ease-out active:scale-95 ${
                            isExpanded
                              ? 'border-[#ffa116] bg-[#ffa116]/15 text-[#ffa116] shadow-[0_0_10px_rgba(255,161,22,0.25)]'
                              : 'border-[#383838] bg-[#2d2d2d] text-[#8a8a8a] hover:border-[#ffa116]/60 hover:bg-[#333333] hover:text-[#ffa116]'
                          }`}
                          aria-label="Toggle Quick Hint"
                        >
                          <Lightbulb className={`h-3.5 w-3.5 transition-transform duration-200 ${isExpanded ? 'scale-110 fill-[#ffa116]/30 text-[#ffa116]' : 'group-hover:scale-110'}`} />
                          <span className="text-[11px]">Hint</span>
                        </button>

                        {/* Practice Button */}
                        <Link
                          to="/coding"
                          className="group relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#ffa116] px-3.5 py-1.5 text-xs font-bold text-black transition-all duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_0_16px_rgba(255,161,22,0.4)] active:scale-95 active:duration-100"
                        >
                          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/35 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full" />
                          <span>Practice</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Collapsible Quick Hint Panel */}
                  {isExpanded && (
                    <div className="mx-3 mb-3.5 rounded-xl border border-[#383838] bg-[#1a1a1a] p-4 text-xs transition-all duration-200 ease-out shadow-lg">
                      <div className="mb-3 flex items-center justify-between border-b border-[#333333] pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#ffa116]/15 text-[#ffa116]">
                            <Lightbulb className="h-3.5 w-3.5" />
                          </div>
                          <span className="font-semibold text-white">Interview Hint & Strategy Breakdown</span>
                          <span className="rounded bg-[#2e2e2e] border border-[#383838] px-2 py-0.5 text-[10px] font-medium text-[#ffa116]">
                            {question.pattern}
                          </span>
                        </div>
                        <button
                          onClick={() => toggleHint(question.id)}
                          className="rounded p-1 text-[#8a8a8a] transition-colors hover:bg-[#282828] hover:text-white"
                          aria-label="Close Hint"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                        {/* Pattern Explanation */}
                        <div className="space-y-1.5 md:col-span-6">
                          <div className="flex items-center gap-1.5 font-medium text-neutral-300">
                            <Sparkles className="h-3.5 w-3.5 text-[#ffa116]" />
                            <span>Pattern Approach</span>
                          </div>
                          <p className="leading-relaxed text-[#b0b0b0]">
                            {hintInfo.patternDesc}
                          </p>
                        </div>

                        {/* Big-O Complexity */}
                        <div className="space-y-1.5 md:col-span-3">
                          <div className="flex items-center gap-1.5 font-medium text-neutral-300">
                            <Clock className="h-3.5 w-3.5 text-[#00b8a3]" />
                            <span>Big-O Expectation</span>
                          </div>
                          <div className="space-y-1.5 pt-0.5">
                            <div className="flex items-center justify-between rounded-lg border border-[#333333] bg-[#262626] px-2.5 py-1.5 text-[11px]">
                              <span className="text-[#8a8a8a]">Target Time:</span>
                              <span className="font-mono font-semibold text-[#00b8a3]">{hintInfo.timeComplexity}</span>
                            </div>
                            <div className="flex items-center justify-between rounded-lg border border-[#333333] bg-[#262626] px-2.5 py-1.5 text-[11px]">
                              <span className="text-[#8a8a8a]">Target Space:</span>
                              <span className="font-mono font-semibold text-[#ffc01e]">{hintInfo.spaceComplexity}</span>
                            </div>
                          </div>
                        </div>

                        {/* Top 2 Edge Cases */}
                        <div className="space-y-1.5 md:col-span-3">
                          <div className="flex items-center gap-1.5 font-medium text-neutral-300">
                            <AlertCircle className="h-3.5 w-3.5 text-[#ff375f]" />
                            <span>Top 2 Edge Cases</span>
                          </div>
                          <ul className="space-y-1 pt-0.5">
                            {hintInfo.edgeCases.map((edgeCase, idx) => (
                              <li key={idx} className="flex items-start gap-1.5 text-[11px] leading-snug text-[#9ca3af]">
                                <span className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-[#ff375f]/15 text-[9px] font-bold text-[#ff375f]">
                                  {idx + 1}
                                </span>
                                <span>{edgeCase}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="col-span-12 space-y-6 lg:col-span-3">
          <ActivityHeatmap />

          <div className="rounded-xl border border-[#383838] bg-[#282828] p-4">
            <h2 className="text-sm font-semibold">Target Role</h2>
            <p className="mt-1 text-xs text-[#8a8a8a]">Frontend Engineer</p>
            <div className="mt-5 flex items-end justify-between">
              <span className="text-3xl font-bold">{Math.round((solvedCount / 250) * 100)}%</span>
              <span className="text-xs text-[#8a8a8a]">prepared</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#383838]">
              <div
                className="h-full rounded-full bg-[#ffa116] transition-all duration-500"
                style={{ width: `${Math.min((solvedCount / 250) * 100, 100)}%` }}
              />
            </div>
            <Link to="/profile" className="mt-4 block text-xs text-[#ffa116] hover:underline">
              Edit target role
            </Link>
          </div>

          <div className="rounded-xl border border-[#383838] bg-[#282828] p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Trending Companies</h2>
              {activeCompany && (
                <button onClick={() => setActiveCompany('')} className="text-[#8a8a8a] hover:text-white" aria-label="Clear company filter">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {companies.map((company, index) => (
                <button
                  key={company}
                  onClick={() => selectCompany(company)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors ${
                    activeCompany === company
                      ? 'bg-[#ffa116]/15 text-[#ffa116] font-medium'
                      : 'bg-[#2d2d2d] text-[#d1d1d1] hover:bg-[#383838]'
                  }`}
                >
                  <span>{company}</span>
                  <span className="text-[#8a8a8a]">{[234, 198, 145][index]} interviews</span>
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;

