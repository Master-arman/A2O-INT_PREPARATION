import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Award, Clock, Target, CheckCircle2, AlertCircle } from 'lucide-react';

const Analytics = () => {
  const [stats, setStats] = useState({
    avgScore: '0/100',
    accuracy: '0%',
    timeSpent: '0h 0m',
    mockInterviews: '0'
  });
  
  const [performanceData, setPerformanceData] = useState([]);
  const [radarData, setRadarData] = useState([]);

  useEffect(() => {
    const savedInterviews = Number(localStorage.getItem('interviewsTaken') || 0);
    const savedAccuracy = Number(localStorage.getItem('codingAccuracy') || 0);
    const savedScore = Number(localStorage.getItem('avgScore') || 0);
    
    const totalMinutes = savedInterviews * 45;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    setStats({
      avgScore: savedInterviews > 0 ? `${savedScore}/100` : 'N/A',
      accuracy: savedInterviews > 0 ? `${savedAccuracy}%` : 'N/A',
      timeSpent: `${hours}h ${minutes}m`,
      mockInterviews: savedInterviews.toString()
    });

    if (savedInterviews === 0) {
      setPerformanceData([
        { date: 'Mon', score: 0, accuracy: 0 },
        { date: 'Tue', score: 0, accuracy: 0 },
        { date: 'Wed', score: 0, accuracy: 0 },
        { date: 'Thu', score: 0, accuracy: 0 },
        { date: 'Fri', score: 0, accuracy: 0 },
        { date: 'Sat', score: 0, accuracy: 0 },
        { date: 'Sun', score: 0, accuracy: 0 },
      ]);
      setRadarData([
        { subject: 'Data Structures', A: 0, fullMark: 100 },
        { subject: 'System Design', A: 0, fullMark: 100 },
        { subject: 'Behavioral', A: 0, fullMark: 100 },
        { subject: 'Databases', A: 0, fullMark: 100 },
        { subject: 'Algorithms', A: 0, fullMark: 100 },
        { subject: 'Networking', A: 0, fullMark: 100 },
      ]);
    } else {
      setPerformanceData([
        { date: 'Mon', score: Math.max(0, savedScore - 15), accuracy: Math.max(0, savedAccuracy - 20) },
        { date: 'Tue', score: Math.max(0, savedScore - 10), accuracy: Math.max(0, savedAccuracy - 15) },
        { date: 'Wed', score: Math.max(0, savedScore - 8), accuracy: Math.max(0, savedAccuracy - 10) },
        { date: 'Thu', score: Math.max(0, savedScore - 5), accuracy: Math.max(0, savedAccuracy - 5) },
        { date: 'Fri', score: savedScore, accuracy: savedAccuracy },
        { date: 'Sat', score: savedScore, accuracy: savedAccuracy },
        { date: 'Sun', score: savedScore, accuracy: savedAccuracy },
      ]);
      setRadarData([
        { subject: 'Data Structures', A: savedScore, fullMark: 100 },
        { subject: 'System Design', A: Math.max(0, savedScore - 10), fullMark: 100 },
        { subject: 'Behavioral', A: Math.min(100, savedScore + 10), fullMark: 100 },
        { subject: 'Databases', A: Math.max(0, savedScore - 5), fullMark: 100 },
        { subject: 'Algorithms', A: savedScore, fullMark: 100 },
        { subject: 'Networking', A: Math.max(0, savedScore - 15), fullMark: 100 },
      ]);
    }
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Performance Analytics</h1>
        <p className="text-gray-400">Track your progress across technical, behavioral, and coding interviews.</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Avg Interview Score', value: stats.avgScore, trend: stats.mockInterviews === '0' ? '0%' : '+5%', icon: Award, color: 'blue' },
          { title: 'Coding Accuracy', value: stats.accuracy, trend: stats.mockInterviews === '0' ? '0%' : '+12%', icon: Target, color: 'green' },
          { title: 'Time Spent', value: stats.timeSpent, trend: stats.mockInterviews === '0' ? '0h' : '+45m', icon: Clock, color: 'purple' },
          { title: 'Mock Interviews', value: stats.mockInterviews, trend: stats.mockInterviews === '0' ? '0' : '+1', icon: TrendingUp, color: 'orange' },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 flex flex-col gap-4 relative overflow-hidden group">
            <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/10 rounded-full blur-2xl group-hover:bg-${stat.color}-500/20 transition-all`} />
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-${stat.color}-500/20 text-${stat.color}-400`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-medium">{stat.trend}</span>
              <span className="text-gray-500">this week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-6 h-[400px] flex flex-col">
          <h3 className="font-bold text-white mb-6">Daily Practice & Score Trend</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="score" name="Interview Score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="accuracy" name="Coding Accuracy" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar Chart (Strengths / Weaknesses) */}
        <div className="glass-panel p-6 h-[400px] flex flex-col">
          <h3 className="font-bold text-white mb-2">Topic Mastery</h3>
          <p className="text-xs text-gray-400 mb-4">Your proficiency across domains</p>
          <div className="flex-1 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weak & Strong Topics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border-t-4 border-t-green-500">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            Strong Topics
          </h3>
          <div className="space-y-3">
            {['Behavioral Questions', 'Data Structures (Arrays/Maps)', 'React/Frontend Basics'].map((topic, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-gray-300 font-medium">{topic}</span>
                <span className="text-green-400 text-sm font-bold">Top 10%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 border-t-4 border-t-red-500">
          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            Areas for Improvement
          </h3>
          <div className="space-y-3">
            {[
              { topic: 'System Design (Scale)', action: 'Watch Course' },
              { topic: 'Dynamic Programming', action: 'Practice Now' },
              { topic: 'Computer Networks', action: 'Read Notes' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
                <span className="text-gray-300 font-medium">{item.topic}</span>
                <button className="text-xs font-bold px-3 py-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30 transition-colors">
                  {item.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
